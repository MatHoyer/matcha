import { events, Infer, TUser } from '@matcha/common';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
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

const isBlocked = async (id: number, otherId: number) => {
  const blocked = await db.block.findFirst({
    where: {
      OR: [
        {
          userId: id,
          blockedId: otherId,
        },
        {
          userId: otherId,
          blockedId: id,
        },
      ],
    },
  });
  return blocked ? true : false;
};

export const socketHandler = (io: Server) => {
  io.on('connection', async (socket: Socket) => {
    const cookies = parse(socket.handshake.headers.cookie || '');
    const token = cookies['auth-token'];
    if (!token) {
      socket.disconnect();
      return;
    }
    try {
      const userPayload = jwt.verify(token, env.JWT_SECRET) as {
        id: TUser['id'];
      };
      const dbUser = await db.user.findFirst({
        where: {
          id: userPayload.id,
        },
      });
      if (!dbUser) {
        socket.disconnect();
        return;
      }
      const user = connectedUsers.find((user) => user.id === dbUser.id);
      if (!user) {
        connectedUsers.push({
          ...dbUser,
          socket,
        });
      } else {
        user.socket = socket;
      }

      await db.user.update({
        where: {
          id: dbUser.id,
        },
        data: {
          isOnline: true,
        },
      });
    } catch (error) {
      console.error('Error parsing token', error);
      socket.disconnect();
      return;
    }

    socketMiddleware(socket, {
      'send-message': async (args) => {
        const { senderId, receiverId, message } = args;
        if (await isBlocked(senderId, receiverId)) return;
        await db.message.create({
          data: {
            userId: senderId,
            receiverId: receiverId,
            message: message,
            date: new Date(),
          },
        });

        const sender = connectedUsers.find((u) => u.id === senderId);
        if (!sender) return;
        const receiver = connectedUsers.find((u) => u.id === receiverId);
        if (!receiver) return;

        await db.notification.create({
          data: {
            userId: receiverId,
            otherUserId: senderId,
            type: 'Message',
            date: new Date(),
            read: false,
          },
        });
        const otherUser = await db.user.findFirst({
          where: {
            id: senderId,
          },
        });

        receiver.socket.emit(`pv-${receiver.id}-${sender.id}`, { message });
        receiver.socket.emit(`notification-${receiver.id}`, {
          id: nanoid(),
          userId: receiverId,
          otherUserId: senderId,
          otherUser: otherUser,
          type: 'Message',
          date: new Date(),
          read: false,
        });
        receiver.socket.emit(`notification-bubble`);
      },
      'send-feedback': async (args) => {
        const { senderId, receiverId, message } = args;
        if (await isBlocked(senderId, receiverId)) return;

        const sender = connectedUsers.find((u) => u.id === senderId);
        if (!sender) return;
        const receiver = connectedUsers.find((u) => u.id === receiverId);
        if (!receiver) return;

        receiver.socket.emit(`feedback-${receiver.id}-${sender.id}`, {
          message,
        });
      },
      'send-like-unlike': async (args) => {
        const { senderLikeId, receiverLikeId } = args;
        if (await isBlocked(senderLikeId, receiverLikeId)) return;
        const sender = await db.user.findFirst({
          where: {
            id: senderLikeId,
          },
        });
        if (!sender) return;
        const receiver = await db.user.findFirst({
          where: {
            id: receiverLikeId,
          },
        });
        if (!receiver) return;

        const like = await db.like.findFirst({
          where: {
            userId: senderLikeId,
            likedId: receiverLikeId,
          },
        });

        if (like) {
          const match = await db.like.findFirst({
            where: {
              userId: receiverLikeId,
              likedId: senderLikeId,
            },
          });

          if (match) {
            // Notif match to both users
            await db.notification.create({
              data: {
                userId: receiverLikeId,
                otherUserId: senderLikeId,
                type: 'Match',
                date: new Date(),
                read: false,
              },
            });
            await db.notification.create({
              data: {
                userId: senderLikeId,
                otherUserId: receiverLikeId,
                type: 'Match',
                date: new Date(),
                read: false,
              },
            });
            const receiverOnline = connectedUsers.find(
              (u) => u.id === receiver.id
            );
            if (receiverOnline) {
              receiverOnline.socket.emit(`notification-${receiver.id}`, {
                id: nanoid(),
                userId: receiverLikeId,
                otherUserId: senderLikeId,
                otherUser: sender,
                type: 'Match',
                date: new Date(),
                read: false,
              });
              receiverOnline.socket.emit(`notification-bubble`);
            }

            const senderOnline = connectedUsers.find((u) => u.id === sender.id);
            if (senderOnline) {
              senderOnline.socket.emit(`notification-${sender.id}`, {
                id: nanoid(),
                userId: senderLikeId,
                otherUserId: receiverLikeId,
                otherUser: receiver,
                type: 'Match',
                date: new Date(),
                read: false,
              });
              senderOnline.socket.emit(`notification-bubble`);
            }
          } else {
            // No match just a like
            await db.notification.create({
              data: {
                userId: receiverLikeId,
                otherUserId: senderLikeId,
                type: 'Like',
                date: new Date(),
                read: false,
              },
            });
            const receiverOnline = connectedUsers.find(
              (u) => u.id === receiver.id
            );
            if (receiverOnline) {
              receiverOnline.socket.emit(`notification-${receiver.id}`, {
                id: nanoid(),
                userId: receiverLikeId,
                otherUserId: senderLikeId,
                otherUser: sender,
                type: 'Like',
                date: new Date(),
                read: false,
              });
            }
          }
        } else {
          // Unlike notif
          await db.notification.create({
            data: {
              userId: receiverLikeId,
              otherUserId: senderLikeId,
              type: 'Unlike',
              date: new Date(),
              read: false,
            },
          });
          const receiverOnline = connectedUsers.find(
            (u) => u.id === receiver.id
          );

          if (receiverOnline) {
            receiverOnline.socket.emit(`notification-${receiver.id}`, {
              id: nanoid(),
              userId: receiverLikeId,
              otherUserId: senderLikeId,
              otherUser: sender,
              type: 'Unlike',
              date: new Date(),
              read: false,
            });
            receiverOnline.socket.emit(`notification-bubble`);
          }
        }
      },
      'send-view': async (args) => {
        const { senderViewId, receiverViewId } = args;
        console.log('send view enter');
        if (await isBlocked(senderViewId, receiverViewId)) return;
        console.log('send view enter 2');
        const senderView = await db.like.findFirst({
          where: {
            userId: senderViewId,
            likedId: receiverViewId,
          },
        });
        const receiverView = await db.like.findFirst({
          where: {
            userId: receiverViewId,
            likedId: senderViewId,
          },
        });
        if (!senderView || !receiverView) {
          console.log('about to create view');
          await db.view.create({
            data: {
              userId: receiverViewId,
              viewerId: senderViewId,
              date: new Date(),
            },
          });
          await db.notification.create({
            data: {
              userId: receiverViewId,
              otherUserId: senderViewId,
              type: 'View',
              date: new Date(),
              read: false,
            },
          });
          const receiver = await db.user.findFirst({
            where: {
              id: receiverViewId,
            },
          });
          if (!receiver) return;
          const sender = await db.user.findFirst({
            where: {
              id: senderViewId,
            },
          });
          if (!sender) return;
          const receiverOnline = connectedUsers.find(
            (u) => u.id === receiver.id
          );

          if (receiverOnline) {
            receiverOnline.socket.emit(`notification-${receiverViewId}`, {
              userId: receiverViewId,
              otherUserId: senderViewId,
              otherUser: sender,
              type: 'View',
              date: new Date(),
              read: false,
            });
            receiverOnline.socket.emit(`notification-bubble`);
          }
        }
      },
      disconnect: async (_args) => {
        const user = connectedUsers.find((u) => u.socket.id === socket.id);
        if (!user) return;
        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            isOnline: false,
            lastTimeOnline: new Date(),
          },
        });
        connectedUsers.splice(connectedUsers.indexOf(user), 1);
      },
    });
  });
};
