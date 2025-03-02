// const socketMiddleware = (
//   socket: Socket,
//   eventHandlers: Record<string, (...args: any) => void>
// ) => {
//   for (const [event, handler] of Object.entries(eventHandlers)) {
//     socket.on(event, (...args) => {
//       if (event !== 'disconnect')
//         console.log(`${yellow}${event} event triggered${reset}`);
//       handler(...args);
//     });
//   }
// };

// io.on('connection', (socket) => {
//   console.log(`${yellow}${bold}New client connected${reset}`);

//   socketMiddleware(socket, {
//     disconnect: () => {
//       console.log(`${yellow}${bold}Client disconnected${reset}`);
//     },
//     // Public events

//     // Manager events
//     'create-spectacle': (speactacleDate) => {
//       io.emit('create-spectacle', speactacleDate);
//     },
//     'delete-spectacle': ({ id, date }) => {
//       io.emit('delete-spectacle', { id, date });
//     },
//     'update-spectacle': ({ id, field, value }) => {
//       io.emit(`update-spectacle-${id}`, { field, value });
//     },
//     'add-reservation': ({ spectacleId, reservation }) => {
//       io.emit(`add-reservation-${spectacleId}`, reservation);
//     },
//     'remove-reservation': ({ spectacleId, reservationId }) => {
//       io.emit(`remove-reservation-${spectacleId}`, reservationId);
//     },
//     'update-reservation': ({ id, field, value }) => {
//       io.emit(`update-reservation-${id}`, { field, value });
//     },
//   });
// });
