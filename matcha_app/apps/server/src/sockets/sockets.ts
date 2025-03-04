import { events, Infer, TUser } from '@matcha/common';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import db from '../database/Database';
import { env } from '../env';

type Events = typeof events;
type InferEvent<T extends keyof Events> = Infer<Events[T]>;

const socketMiddleware = <T extends keyof Events>(
  socket: Socket,
  eventHandlers: { [K in T]: (args: InferEvent<K>) => void }
) => {
  for (const [event, handler] of Object.entries(eventHandlers) as [
    T,
    (args: InferEvent<T>) => void
  ][]) {
    socket.on(event as string, (args: unknown) => {
      try {
        events[event].parse(args);
        // eslint-disable-next-line
        handler(args as any);
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
// const allUsers = [] as TUser[];

export const socketHandler = (io: Server) => {
  io.on('connection', async (socket: Socket) => {
    const allUsers = await db.user.findMany({});
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

    socketMiddleware(socket, {
      'send-message': async (args) => {
        const { senderId, receiverId, message } = args; // args parsed in socketMiddleware

        const sender = connectedUsers.find((u) => u.id === senderId);
        if (!sender) return;
        const receiverDb = allUsers.find((u) => u.id === receiverId);
        if (!receiverDb) return;

        await db.message.create({
          data: {
            userId: senderId,
            receiverId: receiverId,
            message: message,
            date: new Date(),
          },
        });

        const receiver = connectedUsers.find((u) => u.id === receiverId);
        if (!receiver) return;

        // console.log('about to save message');
        // saveMessage(senderId, receiverId, message, new Date());

        receiver.socket.emit(`pv-${receiver.id}-${sender.id}`, { message });
      },
      'send-feedback': (args) => {
        console.log('send-feedback from back');
        const { senderId, receiverId, message } = args;

        const sender = connectedUsers.find((u) => u.id === senderId);
        if (!sender) return;
        const receiver = connectedUsers.find((u) => u.id === receiverId);
        if (!receiver) return;

        receiver.socket.emit(`feedback-${receiver.id}-${sender.id}`, {
          message,
        });
      },
      disconnect: (_args) => {
        console.log(`User disconnected: ${socket.id}`);
      },
    });
  });
};
