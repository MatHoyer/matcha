import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
// import { useSetNotification } from '@/hooks/use-notification';
import { useSession } from '@/hooks/useSession';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { socket } from '@/lib/socket';
import { cn } from '@/lib/utils';
import {
  getNearDate,
  getUrl,
  messagesSchemas,
  TMessage,
  TSendMessageSchema,
  TUser,
  updateNotificationSchemas,
} from '@matcha/common';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Minus, Send, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAvatar } from '../images/UserAvatar';
import { Typography } from '../ui/typography';

interface PrivateChatProps {
  otherUser: Omit<TUser, 'password'>;
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
  // const { notifications, setNotifications } = useSetNotification();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useQuery({
    queryKey: ['messages', session.user!.id],
    queryFn: async () => {
      return await axiosFetch({
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
            const formattedMessages = filteredMessages.map((msg: TMessage) => ({
              name:
                msg.userId === session.user!.id
                  ? session.user!.name
                  : otherUser.name,
              message: msg.message,
              dateTime: msg.date,
              isOwnMessage: msg.userId === session.user!.id,
            }));
            setMessages(formattedMessages);
          },
        },
      });
    },
  });

  const setReadMessageNotif = useMutation({
    mutationFn: async () => {
      return await axiosFetch({
        method: 'POST',
        url: getUrl('api-notifications', { type: 'update' }),
        schemas: updateNotificationSchemas,
        data: {
          userId: session.user!.id,
          otherUserId: otherUser.id,
          type: 'Message',
          read: true,
        },
        handleEnding: {
          cb: () => {
            queryClient.invalidateQueries({
              queryKey: ['notifications'],
            });
          },
        },
      });
    },
  });

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

    socket.on(`pv-${session.user!.id}-${otherUser.id}`, messageHandler);
    socket.on(`feedback-${session.user!.id}-${otherUser.id}`, feedbackHandler);

    return () => {
      socket.off(`pv-${session.user!.id}-${otherUser.id}`, messageHandler);
    };
  }, []);

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const socketEmitter = (type: string, data: TSendMessageSchema) => {
    const receiverId = data.receiverId;
    const senderId = data.senderId;
    const message = data.message;
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
    <Card
      className="p-3 w-80 h-fit "
      onClick={() => setReadMessageNotif.mutate()}
    >
      <div
        className={cn(
          'flex items-center justify-between',
          status === 'full' && 'mb-2'
        )}
      >
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 px-2 py-1 rounded-md w-2/3"
          onClick={() => navigate(`/profile/${otherUser.id}`)}
        >
          <UserAvatar user={otherUser} size="sm" />
          <Typography variant="small" className="truncate">
            {otherUser.name} {otherUser.lastName}
          </Typography>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => toggleChat()}>
            <Minus />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => closeChat()}>
            <X />
          </Button>
        </div>
      </div>
      {status === 'full' && (
        <>
          <ul
            id="message-container"
            className="relative flex flex-col h-60 overflow-y-auto rounded-lg p-3 shadow-inner"
          >
            {messages.map((data, index) => (
              <li
                key={index}
                className={`p-2 mb-2 rounded-md border
                  ${
                    data.isOwnMessage
                      ? 'self-end border-[#8c52ff81]'
                      : 'border-[#ffacac83]'
                  }
                `}
              >
                <p className="text-sm break-all whitespace-normal">
                  {data.message}
                </p>
                <span className="text-xs block text-gray-400">
                  {data.name} • {getNearDate(data.dateTime)}
                </span>
              </li>
            ))}
            {feedback && (
              <li className="mt-auto text-center text-sm italic text-gray-400">
                {feedback}
              </li>
            )}
            <div ref={messageEndRef} />
          </ul>

          <form
            id="message-form"
            onSubmit={sendMessage}
            className="mt-4 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <Input
                id="message-input"
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                onFocus={() =>
                  sendFeedback(`${session.user?.name} is typing...`)
                }
                onKeyDown={() =>
                  sendFeedback(`${session.user?.name} is typing...`)
                }
                onBlur={() => sendFeedback('')}
              />
              <Button type="submit" variant="outline">
                <Send />
              </Button>
            </div>
          </form>
        </>
      )}
    </Card>
  );
};
