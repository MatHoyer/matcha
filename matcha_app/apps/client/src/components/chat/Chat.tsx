import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { useSession } from '@/hooks/useSession';
import { socket } from '@/lib/socket';
import { getUrl, messagesSchemas, TSendMessageSchema } from '@matcha/common';
import { TUser } from '@matcha/common';
import { Minus, X } from 'lucide-react';
import moment from 'moment';
import React, { use, useEffect, useState } from 'react';
import { TMessage } from '@matcha/common';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { closeGlobalDialog } from '@/hooks/use-dialog';

interface PrivateChatProps {
  otherUser: TUser;
  status: 'full' | 'collapse';
  toggleChat: () => void;
  closeChat: () => void;
}

export const Chat: React.FC<PrivateChatProps> = ({
  otherUser,
  status,
  toggleChat,
  closeChat,
}) => {
  const session = useSession();
  const [messages, setMessages] = useState<
    { name: string; message: string; dateTime: Date; isOwnMessage: boolean }[]
  >([]);
  const [message, setMessage] = useState<string>('');
  const [feedback, setFeedback] = useState('');

  const [chatMessages, setChatMessages] = useState<TMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        await axiosFetch({
          method: 'POST',
          url: getUrl('api-messages'),
          schemas: messagesSchemas,
          data: { userId: session.user!.id },
          handleEnding: {
            cb: (data) => {
              const filteredMessages = data.messages.filter(
                (msg: TMessage) =>
                  (msg.userId === session.user!.id &&
                    msg.receiverId === otherUser.id) ||
                  (msg.userId === otherUser.id &&
                    msg.receiverId === session.user!.id)
              );
              const formattedMessages = filteredMessages.map(
                (msg: TMessage) => ({
                  name:
                    msg.userId === session.user!.id
                      ? session.user!.name
                      : otherUser.name,
                  message: msg.message,
                  dateTime: msg.date,
                  isOwnMessage: msg.receiverId === session.user!.id,
                })
              );
              setChatMessages(chatMessages);
              setMessages(formattedMessages);
            },
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    const messageHandler = ({ message }: { message: string }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          name: otherUser.name,
          message: message,
          dateTime: new Date(),
          isOwnMessage: false,
        },
      ]);
    };

    const feedbackHandler = ({ message }: { message: string }) => {
      setFeedback(message);
    };

    console.log('pv-', session.user!.id, '-', otherUser.id);
    socket.on(`pv-${session.user!.id}-${otherUser.id}`, messageHandler);
    socket.on(`feedback-${session.user!.id}-${otherUser.id}`, feedbackHandler);

    return () => {
      console.log('bye');
      socket.off(`pv-${session.user!.id}-${otherUser.id}`, messageHandler);
    };
  }, []);

  const socketEmitter = (type: string, data: TSendMessageSchema) => {
    const receiverId = data.receiverId;
    const senderId = data.senderId;
    const message = data.message;
    console.log(`emitting ${type} with ${senderId}, ${receiverId}, ${message}`);
    socket.emit(type, { senderId, receiverId, message });
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const messageToSend = message;
    if (messageToSend.trim() === '') return;

    socketEmitter('send-message', {
      receiverId: otherUser.id,
      senderId: session.user!.id,
      message: messageToSend,
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        name: session.user!.name,
        message: messageToSend,
        dateTime: new Date(),
        isOwnMessage: true,
      },
    ]);
    setMessage('');
  };

  const sendFeedback = (feedbackMessage: string) => {
    socketEmitter('send-feedback', {
      receiverId: otherUser.id,
      senderId: session.user!.id,
      message: feedbackMessage,
    });
  };

  return (
    <Card className="p-3 w-80 h-fit">
      <div className="flex items-center justify-between">
        <Typography variant="small">
          Chat with {otherUser.name} {otherUser.id}
        </Typography>
        <div className="flex items-center gap-2">
          <Minus className="cursor-pointer" onClick={() => toggleChat()} />
          <X className="cursor-pointer" onClick={() => closeChat()} />
        </div>
      </div>
      {status === 'full' && (
        <>
          <ul
            id="message-container"
            className="relative flex flex-col h-60 overflow-y-auto bg-gray-800 rounded-lg p-3 shadow-inner"
          >
            {messages.map((data, index) => (
              <li
                key={index}
                className={`p-2 mb-2 rounded-md ${
                  data.isOwnMessage
                    ? 'bg-blue-600 text-white self-end'
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                <p className="text-sm">{data.message}</p>
                <span className="text-xs block text-gray-400">
                  {data.name} • {moment(data.dateTime).fromNow()}
                </span>
              </li>
            ))}
            {feedback && (
              <li className="mt-auto text-center text-sm italic text-gray-400">
                {feedback}
              </li>
            )}
          </ul>

          <form
            id="message-form"
            onSubmit={sendMessage}
            className="mt-4 flex flex-col gap-2"
          >
            <h2 className="text-xs mb-2 font-semibold">
              {session.user!.name} :
            </h2>
            <div className="flex items-center gap-2">
              <Input
                id="message-input"
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onFocus={() =>
                  sendFeedback(`${session.user?.name} is typing...`)
                }
                onKeyDown={() =>
                  sendFeedback(`${session.user?.name} is typing...`)
                }
                onBlur={() => sendFeedback('')}
              />
              <Button type="submit">Send</Button>
            </div>
          </form>
        </>
      )}
    </Card>
  );
};
