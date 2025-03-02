import { sendMessageSchema, TUser } from '@matcha/common';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { env } from '../env';
import { events, eventTypes } from '@matcha/common';
import { Infer } from '@matcha/common';
import { parseArgs } from 'util';

// type EventHandlers = {
//   'send-message': (
//     senderId: number,
//     receiverId: number,
//     message: string
//   ) => void;
//   disconnect: () => void;
// };
type EventHandlers<T extends eventTypes> = {
  [K in T]: (data: Infer<(typeof events)[K]>) => void;
};

const socketMiddleware = <T extends keyof typeof events>(
  socket: Socket,
  eventHandlers: Record<T, (args: Infer<(typeof events)[T]>) => void>
) => {
  for (const [event, handler] of Object.entries(eventHandlers) as [
    keyof typeof eventHandlers,
    (typeof eventHandlers)[keyof typeof eventHandlers]
  ][]) {
    socket.on(event, (...args) => {
      if (event !== 'disconnect') console.log(`${event} event triggered`);
      try {
        const parsedArgs = events[event].parse(args);
        handler(parsedArgs);
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
