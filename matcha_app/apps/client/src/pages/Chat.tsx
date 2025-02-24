import { useSession } from '@/hooks/useSession';
import { useUsers } from '@/hooks/useUsers';
import { socket } from '@/lib/socket';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';

const Chat: React.FC = () => {
  const [clientsTotal, setClientsTotal] = useState<number>(0);
  const [messages, setMessages] = useState<
    { name: string; message: string; dateTime: Date; isOwnMessage: boolean }[]
  >([]);
  const [message, setMessage] = useState<string>('');
  const [feedback, setFeedback] = useState('');

  const messageContainerRef = useRef<HTMLUListElement>(null);

  const { user } = useSession();
  const name = user?.name || 'anonymous';

  const { users } = useUsers();
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string; lastName: string } | null>(null);
  console.log('users : ', users);

  useEffect(() => {
    console.log('This user : ', user?.name);
    socket.on('clients-total', (data: number) => {
      console.log('Received clients-total : ', data);
      setClientsTotal(data);
    });

    socket.on(
      'chat-message',
      (data: { name: string; message: string; dateTime: Date }) => {
        console.log('Received message : ', data);
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...data, isOwnMessage: false },
        ]);
      }
    );

    socket.on('feedback', (data: { feedback: string }) => {
      console.log('Feedback ! ');
      setFeedback(data.feedback);
    });

    return () => {
      socket.off('clients-total');
      socket.off('chat-message');
      socket.off('feedback');
    };
  }, [user?.name]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, feedback]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') return;

    const data = {
      name,
      message,
      dateTime: new Date(),
    };

    socket.emit('message', data);
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...data, isOwnMessage: true },
    ]);
    setMessage('');
  };

  const handleFeedback = (feedbackMessage: string) => {
    socket.emit('feedback', { feedback: feedbackMessage });
  };

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo(
        0,
        messageContainerRef.current.scrollHeight
      );
    }
  };

  const handleUserClick = (user: { id: string; name: string }) => {
    // setSelectedUser(user);
    socket.emit('create-room', user.id);
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-gray-900 text-white border border-gray-600 shadow-lg rounded-lg">
      <h2 className="text-s font-semibold">General chat room</h2>
      <h3 className="text-xs mb-2">Total clients connected: {clientsTotal}</h3>

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
        <p>{name} :</p>
        <div className="flex items-center gap-2">
          <input
            id="message-input"
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => handleFeedback(`${name} is typing...`)}
            onKeyPress={() => handleFeedback(`${name} is typing...`)}
            onBlur={() => handleFeedback('')}
            className="flex-1 p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
        <h2 className="text-lg font-semibold mb-2">Users</h2>
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className="p-2 hover:bg-gray-700 rounded cursor-pointer"
              // onClick={() => handleUserClick(user)}
            >
              {user.name} {user.lastName}
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
};

export default Chat;
