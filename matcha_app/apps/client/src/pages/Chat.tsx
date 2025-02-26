import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { useSession } from '@/hooks/useSession';
import { socket } from '@/lib/socket';
import { SOCKETS_EVENTS } from '@matcha/common';
import { Minus, X } from 'lucide-react';
import moment from 'moment';
import React, { useRef, useState } from 'react';

interface PrivateChatProps {
  roomId: string;
  status: 'full' | 'collapse';
  otherUserName: string;
  toggleChat: () => void;
  closeChat: () => void;
}

export const Chat: React.FC<PrivateChatProps> = ({
  roomId,
  status,
  otherUserName,
  toggleChat,
  closeChat,
}) => {
  const [messages, setMessages] = useState<
    { name: string; message: string; dateTime: Date; isOwnMessage: boolean }[]
  >([]);
  const [message, setMessage] = useState<string>('');
  const [feedback, setFeedback] = useState('');
  const messageContainerRef = useRef<HTMLUListElement>(null);
  const { user } = useSession();
  const name = user?.name || 'anonymous';
  const data = {
    roomId,
    name,
    message,
    dateTime: new Date(),
  };
  // useEffect(() => {
  //   socket.on(
  //     SOCKETS_EVENTS.SERVER.ROOM_MESSAGE,
  //     (data: {
  //       roomId: string;
  //       name: string;
  //       message: string;
  //       dateTime: Date;
  //     }) => {
  //       if (data.roomId === roomId) {
  //         // Listen for messages only from this room
  //         setMessages((prevMessages) => [
  //           ...prevMessages,
  //           { ...data, isOwnMessage: false },
  //         ]);
  //       }
  //     }
  //   );

  //   socket.on('feedback', (data: { feedback: string }) => {
  //     setFeedback(data.feedback);
  //   });

  //   return () => {
  //     socket.off('clients-total');
  //     socket.off('room-message');
  //     socket.off('feedback');
  //   };
  // }, [roomId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') return;

    // socket.emit('send-message', data);
    socket.emit(SOCKETS_EVENTS.CLIENT.SEND_ROOM_MESSAGE, {
      roomId,
      message,
      name,
    });
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...data, isOwnMessage: true },
    ]);
    setMessage('');
  };

  const handleFeedback = (feedbackMessage: string) => {
    socket.emit('feedback', { feedback: feedbackMessage });
  };

  return (
    <Card className="p-3 w-80 h-fit">
      <div className="flex items-center justify-between">
        <Typography variant="small">Chat with {otherUserName}</Typography>
        <div className="flex items-center gap-2">
          <Minus className="cursor-pointer" onClick={() => toggleChat()} />
          <X className="cursor-pointer" onClick={() => closeChat()} />
        </div>
      </div>
      {status === 'full' && (
        <>
          <ul
            ref={messageContainerRef}
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
            {feedback && (
              <li className="text-sm italic text-gray-400">{feedback}</li>
            )}
          </ul>

          <form
            id="message-form"
            onSubmit={sendMessage}
            className="mt-4 flex flex-col gap-2"
          >
            <h2 className="text-xs mb-2 font-semibold">{name} :</h2>
            <div className="flex items-center gap-2">
              <Input
                id="message-input"
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onFocus={() => handleFeedback(`${name} is typing...`)}
                onKeyPress={() => handleFeedback(`${name} is typing...`)}
                onBlur={() => handleFeedback('')}
                // className="flex-1 p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="submit"
                // className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Send
              </Button>
            </div>
          </form>
        </>
      )}
    </Card>
  );
};
