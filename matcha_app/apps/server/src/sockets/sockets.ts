import { TUser } from '@matcha/common';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { env } from '../env';

interface User {
  id: number;
  username: string;
  socket: Socket;
}

const connectedUsers = [] as User[];

export const socketHandler = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    const cookies = parse(socket.handshake.headers.cookie || '');
    const token = cookies['auth-token'];
    if (!token) {
      socket.disconnect();
      return;
    }
    // console.log(connectedUsers);

    try {
      const userPayload = jwt.verify(token, env.JWT_SECRET) as TUser;
      const userExists = connectedUsers.some(
        (user) => user.id === userPayload.id
      );
      if (userExists == false) {
        connectedUsers.push({
          id: userPayload.id,
          username: userPayload.name,
          socket,
        });
        // console.log('connectedUsers', connectedUsers);
      }
    } catch (error) {
      console.error('Error parsing token', error);
      socket.disconnect();
      return;
    }

    socket.on('feedback', (data) => {
      socket.broadcast.emit('feedback', data);
    });

    socket.on('send-message', (data) => {
      const { otherUserId, messageToSend, userId } = data;
      const sender = connectedUsers.find((user) => user.id === userId);
      if (!sender) return;
      const receiver = connectedUsers.find((user) => user.id === otherUserId);
      if (!receiver) return;
      console.log('Sending message to : ', receiver.username);
      receiver.socket.emit(`pv-${receiver.id}-${sender!.id}`, {
        message: messageToSend,
      });
    });

    // socket.on(SOCKETS_EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
    //   console.log('Room created ! : ', roomName);
    //   if (!rooms[roomName]) {
    //     rooms[roomName] = {
    //       id: roomName,
    //     };
    //   }
    //   socket.join(rooms[roomName].id);
    //   console.log('Room just joined ! : ', rooms[roomName].id);
    // });

    // socket.on(SOCKETS_EVENTS.CLIENT.SEND_ROOM_MESSAGE, (data) => {
    //   console.log('Sending message to room : ', data.roomId);
    //   const message = data.messageToSend;
    //   const userName = data.name;
    //   socket.to(data.roomId).emit(SOCKETS_EVENTS.SERVER.ROOM_MESSAGE, {
    //     message,
    //     userName,
    //   });
    // });

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
