import { AUTH_COOKIE_NAME, TUser } from '@matcha/common';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../database/Database';
import { env } from '../env';
import { defaultResponse } from '../utils/defaultResponse';

export const isLogged = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const userToken = jwt.verify(token, env.JWT_SECRET) as TUser;

    console.log(userToken.id);

    const user = await db.user.findFirst({
      where: {
        id: userToken.id,
      },
    });
    if (!user) {
      return defaultResponse({
        res,
        status: 401,
        json: {
          message: 'Unauthorized',
        },
      });
    }

    req.user = user;
    next();
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
