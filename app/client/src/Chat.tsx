import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { socket } from './lib/socket';

const Chat: React.FC = () => {
  const [clientsTotal, setClientsTotal] = useState<number>(0);
  const [messages, setMessages] = useState<{ name: string; message: string; dateTime: Date; isOwnMessage: boolean }[]>(
    []
  );
  const [name, setName] = useState<string>('anonymous');
  const [message, setMessage] = useState<string>('');
  const [feedback, setFeedback] = useState('');

  const messageContainerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    socket.on('clients-total', (data: number) => {
      setClientsTotal(data);
    });

    socket.on('chat-message', (data: { name: string; message: string; dateTime: Date }) => {
      console.log('Received message : ', data);
      setMessages((prevMessages) => [...prevMessages, { ...data, isOwnMessage: false }]);
    });

    socket.on('feedback', (data: { feedback: string }) => {
      setFeedback(data.feedback);
    });

    return () => {
      socket.off('clients-total');
      socket.off('chat-message');
      socket.off('feedback');
    };
  }, []);

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
    setMessages((prevMessages) => [...prevMessages, { ...data, isOwnMessage: true }]);
    setMessage('');
  };

  const handleFeedback = (feedbackMessage: string) => {
    socket.emit('feedback', { feedback: feedbackMessage });
  };

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo(0, messageContainerRef.current.scrollHeight);
    }
  };

  return (
    <div>
      <p>Total clients connected: {clientsTotal}</p>
      <ul ref={messageContainerRef} id="message-container">
        {messages.map((data, index) => (
          <li key={index} className={data.isOwnMessage ? 'message-right' : 'message-left'}>
            <p className="message">
              {data.message}
              <span>
                {' '}
                {data.name} • {moment(data.dateTime).fromNow()}
              </span>
            </p>
          </li>
        ))}
        {feedback && (
          <li className="message-feedback">
            <p className="feedback">{feedback}</p>
          </li>
        )}
      </ul>
      <form id="message-form" onSubmit={sendMessage}>
        <input id="name-input" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input
          id="message-input"
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => handleFeedback(`${name} is typing a message...`)}
          onKeyPress={() => handleFeedback(`${name} is typing a message...`)}
          onBlur={() => handleFeedback('')}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
