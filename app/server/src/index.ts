import cors from 'cors';
import 'dotenv/config';
import express from 'express';
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

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
