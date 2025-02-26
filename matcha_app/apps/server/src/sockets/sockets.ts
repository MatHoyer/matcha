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
      console.log('roomId : ', roomName);

      if (!rooms[roomName]) {
        const roomId = nanoid();
        rooms[roomName] = {
          id: roomId,
        };
        socket.join(roomId);
        console.log('1 .rooms just joined ! : ', roomId);
      } else {
        const roomId = rooms[roomName].id;
        socket.join(roomId);
        console.log('2 .rooms just joined ! : ', roomId);
      }
    });

    socket.on(
      SOCKETS_EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      (room, message: string, userName: string) => {
        const date = new Date();
        const roomId = rooms[room.roomId].id;
        console.log('roomId : ', roomId);
        console.log('mesage about to be send');
        console.log('message : ', message);
        console.log('userName : ', userName);
        // console.log('date : ', date);
        socket.to(roomId).emit(SOCKETS_EVENTS.SERVER.ROOM_MESSAGE, {
          message,
          userName,
          time: `${date.getHours()}:${date.getMinutes()}`,
        });
      }
    );

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
