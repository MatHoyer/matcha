import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { env, envSchema } from './env.ts';
import { default as authRouter } from './routes/auth.route.ts';

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

app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
