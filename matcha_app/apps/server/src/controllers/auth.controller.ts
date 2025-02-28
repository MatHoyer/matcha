import {
  AUTH_COOKIE_NAME,
  Infer,
  sessionSchemas,
  TGender,
  TLoginSchemas,
  TOrientation,
  TSignupSchemas,
  wait,
} from '@matcha/common';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../database/Database.js';
import { env } from '../env.js';
import { hashPassword } from '../services/auth.service.js';
import { defaultResponse } from '../utils/defaultResponse.js';

export const signup = async (req: Request, res: Response) => {
  const { password, gender, preference, ...userData } =
    req.body as TSignupSchemas['requirements'];
  const hashedPassword = hashPassword(password, env.AUTH_SECRET);

  let user = await db.user.findFirst({
    where: {
      email: userData.email,
    },
  });
  if (user) {
    return defaultResponse({
      res,
      status: 409,
      json: {
        message: 'User already exists',
        fields: [{ field: 'email', message: 'User already exists' }],
      },
    });
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
    return defaultResponse({
      res,
      status: 400,
      json: {
        message: 'Error creating user',
      },
    });
  }

  const { password: _, ...userWithoutPassword } = user;

  const token = jwt.sign({ ...userWithoutPassword }, env.JWT_SECRET, {
    expiresIn: 30 * 24 * 60 * 60,
  });

  return defaultResponse({
    res,
    status: 201,
    cookie: {
      name: AUTH_COOKIE_NAME,
      val: token,
      options: {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      },
    },
    json: {
      message: 'Signed in',
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as TLoginSchemas['requirements'];
  const hashedPassword = hashPassword(password, env.AUTH_SECRET);
  await wait(2000);

  const user = await db.user.findFirst({
    where: {
      email,
      password: hashedPassword,
    },
  });
  if (!user) {
    return defaultResponse({
      res,
      status: 401,
      json: {
        message: 'Invalid credentials',
      },
    });
  }

  const { password: _, ...userWithoutPassword } = user;

  const token = jwt.sign({ ...userWithoutPassword }, env.JWT_SECRET, {
    expiresIn: 30 * 24 * 60 * 60,
  });

  return defaultResponse({
    res,
    status: 200,
    cookie: {
      name: AUTH_COOKIE_NAME,
      val: token,
      options: {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      },
    },
    json: {
      message: 'Logged in',
    },
  });
};

export const logout = async (_req: Request, res: Response) => {
  return defaultResponse({
    res,
    status: 200,
    cookie: {
      name: AUTH_COOKIE_NAME,
      val: '',
      options: {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 0,
      },
    },
    json: {
      message: 'Logged out',
    },
  });
};

export const session = async (req: Request, res: Response) => {
  const token = req.cookies[AUTH_COOKIE_NAME] as string;
  if (!token) {
    return defaultResponse({
      res,
      status: 401,
      json: {
        message: 'Unauthorized',
      },
    });
  }

  try {
    const user = jwt.verify(token, env.JWT_SECRET);
    res.status(200).json({ user } as Infer<typeof sessionSchemas.response>);
  } catch (_error) {
    return defaultResponse({
      res,
      status: 401,
      json: {
        message: 'Unauthorized',
      },
    });
  }
};
