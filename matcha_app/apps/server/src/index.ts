import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { Server } from 'socket.io';
import { env, envSchema } from './env.js';
import { default as authRouter } from './routes/auth.route.js';

try {
  envSchema.parse(process.env);
} catch (error) {
  console.error('Error: Bad environment variables');
  process.exit(1);
}

const app = express();
const port = env.SERVER_PORT;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:3001',
    credentials: true,
  })
);

app.use('/api/auth', authRouter);

app.use(express.static(path.join(__dirname, '../../../public/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../public/dist/index.html'));
});

const server = app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

// add for chat ---------------------
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001',
  },
});

// let socketsConnected = new Set<string>();
let clientsTotal = 0;

io.on('connection', (socket) => {
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
// add for chat end -------------------
