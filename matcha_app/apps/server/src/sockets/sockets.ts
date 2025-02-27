import { SOCKETS_EVENTS } from '@matcha/common';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { env } from '../env';
import { nanoid } from 'nanoid';
import { TUser } from '@matcha/common';

interface User {
  id: string;
  username: string;
}

const connectedUsers = new Map<string, User>();
const rooms: Record<string, { id: string }> = {};

export const socketHandler = (io: Server) => {
  io.on('connection', (socket: Socket) => {
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
        console.log('connectedUsers', connectedUsers);
      }
    } catch (error) {
      console.error('Error parsing token', error);
      socket.disconnect();
      return;
    }

    socket.on('feedback', (data) => {
      socket.broadcast.emit('feedback', data);
    });

    socket.on(SOCKETS_EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
      if (!rooms[roomName]) {
        rooms[roomName] = {
          id: roomName,
        };
      }
      socket.join(rooms[roomName].id);
      console.log('Room just joined ! : ', rooms[roomName].id);
    });

    socket.on(SOCKETS_EVENTS.CLIENT.SEND_ROOM_MESSAGE, (data) => {
      console.log('Sending message to room : ', data.roomId);
      const message = data.messageToSend;
      const userName = data.name;
      socket.to(data.roomId).emit(SOCKETS_EVENTS.SERVER.ROOM_MESSAGE, {
        message,
        userName,
      });
    });

    // socket.on(SOCKETS_EVENTS.DISCONNECTION, () => {
    //   for (const roomId of Object.keys(rooms)) {
    //     rooms[roomId].delete(socket.id);
    //     if (rooms[roomId].size === 0) {
    //       delete rooms[roomId];
    //     }
    //   }
    //   connectedUsers.delete(socket.id);
    // });
  });
};

// socket.on('message', (data) => {
//   // const schema = z.object({
//   //   message: z.string(),
//   // });
//   // const parsedData = schema.parse(data);
//   socket.broadcast.emit('private-message', data);
// });
