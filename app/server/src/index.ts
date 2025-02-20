import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { Server } from 'socket.io';
import db from './database/Database.js';
import { Gender, Orientation } from './database/query/type.js';

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', async (req, res) => {
  try {
    // await db.user.remove({
    //   where: {
    //     name: 'crass',
    //   },
    // });
    const users = await db.user.findMany({});
    res.json(users);
  } catch (error) {
    if (error instanceof Error) res.json({ error: error.message });
  }
});

app.post('/create', async (req, res) => {
  try {
    console.log('re');
    const user = await db.user.create({
      name: 'crass',
      age: 25,
      email: 'gsgsdrgdg',
      lastName: 'Doe',
      gender: Gender.Female,
      password: '1234',
      preference: Orientation.Bisexual,
    });
    res.json(user);
  } catch (error) {
    if (error instanceof Error) res.json({ error: error.message });
  }
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
// add for chat end -------------------
