import { Server } from 'socket.io';

export const socketHandler = (io: Server) => {
  let clientsTotal = 0;

  io.on('connection', (socket) => {
    // console.log(socket.id);
    // socketsConnected.add(socket.id);
    clientsTotal++;
    io.emit('clients-total', clientsTotal);
    console.log(clientsTotal);

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
      clientsTotal--;
      io.emit('clients-total', clientsTotal);
    });
  });
};
