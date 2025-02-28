import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { useSession } from '@/hooks/useSession';
import { socket } from '@/lib/socket';
import { TUser } from '@matcha/common';
import { Minus, X } from 'lucide-react';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
    const messageHandler = ({ message }: { message: string }) => {
      console.log('message received !', message);
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

    console.log('pv-', session.user!.id, '-', otherUser.id);
    socket.on(`pv-${session.user!.id}-${otherUser.id}`, messageHandler);

    return () => {
      console.log('bye');
      socket.off(`pv-${session.user!.id}-${otherUser.id}`, messageHandler);
    };
  }, [session.user, otherUser.id]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const messageToSend = message;
    if (messageToSend.trim() === '') return;

    socket.emit('send-message', {
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
            className="h-60 overflow-y-auto bg-gray-800 rounded-lg p-3 shadow-inner"
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
              />
              <Button type="submit">Send</Button>
            </div>
          </form>
        </>
      )}
    </Card>
  );
};
