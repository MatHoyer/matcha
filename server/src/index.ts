import 'dotenv/config';
import express from 'express';
import db from './database/Database.js';
import { Gender, Orientation } from './database/query/type.js';

const app = express();
const port = process.env.PORT;

app.get('/', async (req, res) => {
  const users = await db.user.findMany({
    select: {
      name: true,
      age: true,
      lastName: true,
    },
    include: {
      image: {
        select: {
          url: true,
        },
      },
      location: true,
    },
  });
  res.json(users);
});

app.post('/create', async (req, res) => {
  const user = await db.user.create({
    name: 'Alice',
    age: 25,
    email: 'alice@gmail.com',
    lastName: 'Doe',
    gender: Gender.Female,
    password: '1234',
    preference: Orientation.Bisexual,
  });
  res.json(user);
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
