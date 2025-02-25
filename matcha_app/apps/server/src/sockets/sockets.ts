import { SOCKETS_EVENTS } from '@matcha/common';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { env } from '../env';
import { nanoid } from 'nanoid';
import { TUser } from '@matcha/common';

// const EVENTS = {
//   connection: 'connection',
//   disconnect: 'disconnect',
//   clientsTotal: 'clients-total',
//   CLIENT: {
//     CREATE_ROOM: 'CREATE_ROOM',
//     SEND_ROOM_MESSAGE: 'SEND_ROOM_MESSAGE',
//     JOIN_ROOM: 'JOIN_ROOM',
//   },
//   SERVER: {
//     ROOMS: 'ROOMS',
//     JOINED_ROOM: 'JOINED_ROOM',
//     ROOM_MESSAGE: 'ROOM_MESSAGE',
//   },
// };
interface User {
  id: string;
  username: string;
}

const connectedUsers = new Map<string, User>();
const rooms: Record<string, Set<string>> = {};

export const socketHandler = (io: Server) => {
  io.on(SOCKETS_EVENTS.connection, (socket: Socket) => {
    const cookies = parse(socket.handshake.headers.cookie || '');
    const token = cookies['auth-token'];
    if (!token) {
      socket.disconnect();
      return;
    }

    try {
      const userPayload = jwt.verify(token, env.JWT_SECRET) as User;
      const userExists = Array.from(connectedUsers.values()).some(
        (user) => user.id === userPayload.id
      );
      if (userExists == false) {
        connectedUsers.set(socket.id, {
          id: userPayload.id,
          username: userPayload.username,
        });
      }
      io.emit('clients-total', connectedUsers.size);
      io.emit('connected-users', Array.from(connectedUsers.values()));
    } catch (error) {
      console.error('Error parsing token', error);
      socket.disconnect();
      return;
    }

    const nbUsers = connectedUsers.size;
    io.emit('clients-total', nbUsers);

    // socket.on('message', (data) => {
    //   // const schema = z.object({
    //   //   message: z.string(),
    //   // });
    //   // const parsedData = schema.parse(data);
    //   socket.broadcast.emit('private-message', data);
    // });

    socket.on('feedback', (data) => {
      socket.broadcast.emit('feedback', data);
    });

    socket.on(
      'create-room',
      (
        userId: number,
        otherUserId: number,
        callback: (roomId: string) => void
      ) => {
        const sortedUserIds = [userId, otherUserId].sort();
        let roomId = `chat-${sortedUserIds[0]}-${sortedUserIds[1]}`;
        if (!rooms[roomId]) {
          rooms[roomId] = new Set<string>();
        }
        rooms[roomId].add(socket.id);
        socket.join(roomId);
        callback(roomId);
      }
    );

    socket.on('send-message', (roomId: string, message: string) => {
      io.to(roomId).emit('room-message', { message, sender: socket.id });
    });

    socket.on('disconnect', () => {
      for (const roomId of Object.keys(rooms)) {
        rooms[roomId].delete(socket.id);
        if (rooms[roomId].size === 0) {
          delete rooms[roomId];
        }
      }
      connectedUsers.delete(socket.id);
    });
  });
};
