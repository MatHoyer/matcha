import { sendMessageSchema, TUser } from '@matcha/common';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { env } from '../env';

type EventHandlers = {
  'send-message': (
    senderId: number,
    receiverId: number,
    message: string
  ) => void;
  disconnect: () => void;
};

const socketMiddleware = (
  socket: Socket,
  eventHandlers: Record<string, (...args: any) => void>
) => {
  for (const [event, handler] of Object.entries(eventHandlers)) {
    socket.on(event, (...args) => {
      if (event !== 'disconnect') console.log(`${event} event triggered`);
      try {
        handler(...args);
      } catch (error) {
        console.error(`Error handling event ${event}`, error);
      }
    });
  }
};

type TUserManager = {
  socket: Socket;
} & TUser;

const connectedUsers = [] as TUserManager[];

export const socketHandler = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    const cookies = parse(socket.handshake.headers.cookie || '');
    const token = cookies['auth-token'];
    if (!token) {
      socket.disconnect();
      return;
    }
    try {
      const userPayload = jwt.verify(token, env.JWT_SECRET) as TUser;
      const user = connectedUsers.find((user) => user.id === userPayload.id);
      if (!user) {
        connectedUsers.push({
          ...userPayload,
          socket,
        });
      } else {
        user.socket = socket;
      }
    } catch (error) {
      console.error('Error parsing token', error);
      socket.disconnect();
      return;
    }

    const eventHandlers: EventHandlers = {
      'send-message': (senderId, receiverId, message) => {
        try {
          // const { senderId, receiverId, message } =
          //   sendMessageSchema.parse(data);
          console.log('Message received ! : ', senderId, receiverId, message);
          const sender = connectedUsers.find((u) => u.id === senderId);
          if (!sender) return;
          const receiver = connectedUsers.find((u) => u.id === receiverId);
          if (!receiver) return;
          receiver.socket.emit(`pv-${receiver.id}-${sender.id}`, { message });
        } catch (error) {
          console.error('Error parsing message', error);
        }
      },
      disconnect: () => {
        console.log(`User disconnected: ${socket.id}`);
      },
    };

    socketMiddleware(socket, eventHandlers);
  });
};
