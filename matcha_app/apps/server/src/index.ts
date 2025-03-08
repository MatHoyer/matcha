import { getUrl } from '@matcha/common';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { Server } from 'socket.io';
import { env, envSchema } from './env.js';
import { default as authRouter } from './routes/auth.route.js';
import globalLocationRouter from './routes/globalLocation.route.js';
import likeRouter from './routes/like.route.js';
import messagesRouter from './routes/messages.route.js';
import notificationsRouter from './routes/notifications.route.js';
import pictureRouter from './routes/picture.route.js';
import searchRouter from './routes/search.route.js';
import tagRouter from './routes/tag.route.js';
import userRouter from './routes/user.route.js';
import { socketHandler } from './sockets/sockets.js';

try {
  envSchema.parse(env);
} catch (error) {
  console.error('Error: Bad environment variables: ' + error);
  process.exit(1);
}

const app = express();

app.use(
  express.json({
    limit: '4mb',
  })
);
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
app.use(getUrl('api-tags'), tagRouter);
app.use(getUrl('api-globalLocations'), globalLocationRouter);
app.use(getUrl('api-users'), userRouter);
app.use(getUrl('api-search'), searchRouter);
app.use(getUrl('api-messages'), messagesRouter);
app.use(getUrl('api-picture'), pictureRouter);
app.use(getUrl('api-notifications'), notificationsRouter);
app.use(getUrl('api-likes'), likeRouter);

if (env.NODE_ENV === 'PROD') {
  app.use(express.static(path.join(__dirname, '../../../public/dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../../public/dist/index.html'));
  });
}

const server = app.listen(env.SERVER_PORT, () => {
  console.log(`Server started at http://localhost:${env.SERVER_PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: `http://localhost:${env.CLIENT_PORT}`,
    credentials: true,
  },
});
socketHandler(io);
