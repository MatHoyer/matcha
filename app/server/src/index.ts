import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { default as authRouter } from './routes/auth.route.js';

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
