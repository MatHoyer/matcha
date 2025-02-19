import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../database/Database.js';
import { Gender, Orientation } from '../database/query/type.js';
import { env } from '../env.js';
import type { TLoginSchema, TSigninSchema } from '../schemas/auth.schema.js';
import { hashPassword } from '../services/auth.service.js';

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body as TSigninSchema;
  const hashedPassword = hashPassword(password, env.AUTH_SECRET);

  let user = await db.user.findFirst({
    where: {
      email,
    },
  });
  if (user && user.length > 0) {
    res.status(409).json({ message: 'User already exists' });
    return;
  }

  user = await db.user.create({
    data: {
      email,
      password: hashedPassword,
      age: 0,
      name: 'John',
      lastName: 'Doe',
      gender: Gender.Female,
      preference: Orientation.Bisexual,
    },
  });
  // remove cringe check after good prisma update
  if (!user || user.length === 0 || Array.isArray(user)) {
    res.status(500).json({ message: 'Error creating user' });
    return;
  }

  const { password: _, ...userWithoutPassword } = user;

  const token = jwt.sign({ ...userWithoutPassword }, env.JWT_SECRET, {
    expiresIn: 30 * 24 * 60 * 60,
  });

  res.status(200).json({
    data: {
      token,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as TLoginSchema;
  const hashedPassword = hashPassword(password, env.AUTH_SECRET);

  const user = await db.user.findFirst({
    where: {
      email,
      password: hashedPassword,
    },
  });
  // remove cringe check after good prisma update
  if (!user || user.length === 0 || Array.isArray(user)) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const { password: _, ...userWithoutPassword } = user;

  const token = jwt.sign({ ...userWithoutPassword }, env.JWT_SECRET, {
    expiresIn: 30 * 24 * 60 * 60,
  });

  res.status(200).json({
    data: {
      token,
    },
  });
};
