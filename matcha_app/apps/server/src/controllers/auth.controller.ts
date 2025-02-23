import {
  AUTH_COOKIE_NAME,
  Infer,
  loginSchemas,
  sessionSchemas,
  signupSchemas,
  TErrorSchema,
  TGender,
  TOrientation,
  wait,
} from '@matcha/common';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../database/Database.js';
import { env } from '../env.js';
import { hashPassword } from '../services/auth.service.js';

export const signup = async (req: Request, res: Response) => {
  const { password, gender, preference, ...userData } = req.body as Infer<
    typeof signupSchemas.requirements
  >;
  const hashedPassword = hashPassword(password, env.AUTH_SECRET);

  let user = await db.user.findFirst({
    where: {
      email: userData.email,
    },
  });
  if (user) {
    res.status(409).json({ message: 'User already exists' } as TErrorSchema);
    return;
  }

  user = await db.user.create({
    data: {
      gender: gender as TGender,
      preference: preference as TOrientation,
      password: hashedPassword,
      ...userData,
    },
  });
  if (!user) {
    res.status(500).json({ message: 'Error creating user' } as TErrorSchema);
    return;
  }

  const { password: _, ...userWithoutPassword } = user;

  const token = jwt.sign({ ...userWithoutPassword }, env.JWT_SECRET, {
    expiresIn: 30 * 24 * 60 * 60,
  });

  res
    .status(200)
    .cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .json({
      message: 'Signed in',
    } as Infer<typeof signupSchemas.response>);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as Infer<
    typeof loginSchemas.requirements
  >;
  const hashedPassword = hashPassword(password, env.AUTH_SECRET);
  await wait(2000);

  const user = await db.user.findFirst({
    where: {
      email,
      password: hashedPassword,
    },
  });
  // remove cringe check after good prisma update
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' } as TErrorSchema);
    return;
  }

  const { password: _, ...userWithoutPassword } = user;

  const token = jwt.sign({ ...userWithoutPassword }, env.JWT_SECRET, {
    expiresIn: 30 * 24 * 60 * 60,
  });

  res
    .status(200)
    .cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .json({
      message: 'Logged in',
    } as Infer<typeof loginSchemas.response>);
};

export const logout = async (_req: Request, res: Response) => {
  res
    .status(200)
    .cookie(AUTH_COOKIE_NAME, '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 0,
    })
    .json({
      message: 'Logged out',
    } as Infer<typeof loginSchemas.response>);
};

export const session = async (req: Request, res: Response) => {
  const token = req.cookies[AUTH_COOKIE_NAME] as string;
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' } as TErrorSchema);
    return;
  }

  try {
    const user = jwt.verify(token, env.JWT_SECRET);
    res.status(200).json({ user } as Infer<typeof sessionSchemas.response>);
  } catch (_error) {
    res.status(401).json({ message: 'Unauthorized' } as TErrorSchema);
  }
};
