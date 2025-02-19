import crypto from 'crypto';
import type { Request, Response } from 'express';
import { env } from '../env.js';
import type { TLoginSchema } from '../schemas/auth.schema.js';

export const hashPassword = (password: string, salt: string) => {
  const hash = crypto.createHash('sha256');

  const saltedPassword = `${salt}${password}`;

  hash.update(saltedPassword);

  const hashedPassword = hash.digest('hex');

  return hashedPassword;
};

export const signin = async (req: Request, res: Response) => {
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).json({ message: 'Signin' });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as TLoginSchema;
  const hashedPassword = hashPassword(password, env.AUTH_SECRET);

  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).json({ message: 'Login' });
};
