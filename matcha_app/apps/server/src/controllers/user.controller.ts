import {
  AUTH_COOKIE_NAME,
  getUsersSchemas,
  Infer,
  TUpdateUserSchemas,
  z,
} from '@matcha/common';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../database/Database';
import { env } from '../env';
import { defaultResponse } from '../utils/defaultResponse';

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({});
    res.status(200).json({ users } as Infer<typeof getUsersSchemas.response>);
  } catch (error) {
    console.error('Error fetching users:', error);
    defaultResponse({
      res,
      status: 500,
      json: { message: 'Internal Server Error' },
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const paramsSchema = z.object({
      id: z.number(),
    });
    paramsSchema.parse({ id: +id });
    const user = await db.user.findFirst({
      where: {
        id: +id,
      },
    });
    if (!user) {
      return defaultResponse({
        res,
        status: 404,
        json: {
          message: 'User not found',
        },
      });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    defaultResponse({
      res,
      status: 500,
      json: { message: 'Internal Server Error' },
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const paramsSchema = z.object({
      id: z.number(),
    });
    paramsSchema.parse({ id: +id });
  } catch (_error) {
    defaultResponse({
      res,
      status: 400,
      json: { message: 'Invalid request' },
    });
  }

  const user = await db.user.findFirst({
    where: {
      id: +id,
    },
  });
  if (!user) {
    return defaultResponse({
      res,
      status: 404,
      json: { message: 'User not found' },
    });
  }

  if (user.id !== req.user.id) {
    return defaultResponse({
      res,
      status: 403,
      json: { message: 'You are not allowed to update this user' },
    });
  }

  const { name, lastName, email, gender, preference, birthDate } =
    req.body as TUpdateUserSchemas['requirements'];
  await db.user.update({
    where: {
      id: +id,
    },
    data: { name, lastName, email, gender, preference, birthDate },
  });
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
      message: 'User updated',
    },
  });
};
