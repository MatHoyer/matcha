import { getUrl } from '@matcha/common';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { Server } from 'socket.io';
import { env, envSchema } from './env.js';
import { default as authRouter } from './routes/auth.route.js';
import usersRouter from './routes/users.route.js';
import { socketHandler } from './sockets/sockets.js';

try {
  envSchema.parse(env);
} catch (error) {
  console.error('Error: Bad environment variables: ' + error);
  process.exit(1);
}

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: `http://localhost:${env.CLIENT_PORT}`,
    credentials: true,
  })
);

app.get('/api/health', (_req, res) => {
  res.send('OK');
});
app.use(getUrl('api-auth'), authRouter);
app.use(getUrl('api-users'), usersRouter);

app.use(express.static(path.join(__dirname, '../../../public/dist')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../../public/dist/index.html'));
});

const server = app.listen(env.SERVER_PORT, () => {
  console.log(`Server started at http://localhost:${env.SERVER_PORT}`);
});

// add for chat ---------------------
const io = new Server(server, {
  cors: {
    origin: `http://localhost:${env.CLIENT_PORT}`,
    credentials: true,
  },
});

socketHandler(io);
