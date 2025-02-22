import { SOCKETS_EVENTS } from '@matcha/common';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { env } from '../env';

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

const events = SOCKETS_EVENTS;

interface User {
  id: string;
  username: string;
}

const rooms: Record<string, { name: string }> = {};
// const user = jwt.verify(token, env.JWT_SECRET);
const connectedUsers = new Map<string, User>();

export const socketHandler = (io: Server) => {
  let clientsTotal = 0;

  io.on('connection', (socket: Socket) => {
    console.log('User connected : ', socket.id);

    const cookies = cookie.parse(socket.handshake.headers.cookie || '');
    console.log('cookies :', cookies);
    const token = cookies['auth-token'];

    // const token = socket.handshake.auth?.token;
    if (!token) {
      console.log('No token provided, disconnecting');
      socket.disconnect();
      return;
    }

    try {
      const userPayload = jwt.verify(token, env.JWT_SECRET) as User;
      console.log('user id :', userPayload.id);
      const userExists = Array.from(connectedUsers.values()).some(
        (user) => user.id === userPayload.id
      );
      console.log('userExists :', userExists);
      if (userExists == false) {
        console.log('New user connected !, :');
        connectedUsers.set(socket.id, {
          id: userPayload.id,
          username: userPayload.username,
        });
        clientsTotal++;
      } else {
        console.log('user already connected !');
      }
      io.emit('clients-total', clientsTotal);
      io.emit('connected-users', Array.from(connectedUsers.values()));
      console.log('-> client total :', clientsTotal);
      console.log('-> user online :', Array.from(connectedUsers.values()));
    } catch (error) {
      console.error('Error parsing token', error);
      socket.disconnect();
      return;
    }

    // clientsTotal++;
    // io.emit('clients-total', clientsTotal);
    // console.log('-> client total :', clientsTotal);

    socket.on('message', (data) => {
      // console.log(data);
      socket.broadcast.emit('chat-message', data);
    });

    socket.on('feedback', (data) => {
      socket.broadcast.emit('feedback', data);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected', socket.id);
      // socketsConnected.delete(socket.id);
      // clientsTotal--;
      io.emit('clients-total', clientsTotal);
    });
  });
};
