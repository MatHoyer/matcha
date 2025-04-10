import {
  AUTH_COOKIE_NAME,
  Infer,
  sessionSchemas,
  TGender,
  TLoginSchemas,
  TOrientation,
  TSignupSchemas,
} from '@matcha/common';
import { setHours } from 'date-fns';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../database/Database.js';
import { LoginMail } from '../emails/patterns/LoginMail.js';
import { SignupMail } from '../emails/patterns/SignupMail.js';
import { sendEmail } from '../emails/sendEmail.js';
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
      birthDate: setHours(userData.birthDate, 3),
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

  const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
    expiresIn: '5m',
  });

  await sendEmail({
    to: user.email,
    subject: 'Welcome to Matcha',
    html: SignupMail({
      linkText: 'Confirm my account',
      link: `${
        env.NODE_ENV === 'DEV'
          ? `http://localhost:${env.CLIENT_PORT}/`
          : env.SERVER_URL
      }auth/confirm/${token}`,
    }),
  });

  const resendToken = jwt.sign({ id: user.id }, env.JWT_SECRET, {
    expiresIn: '5m',
  });

  res.status(201).json({
    message: 'Successfully signed up',
    resendToken,
  });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body as TLoginSchemas['requirements'];
  const hashedPassword = hashPassword(password, env.AUTH_SECRET);

  const user = await db.user.findFirst({
    where: {
      username,
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

  if (!user.isActivate) {
    const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
      expiresIn: '5m',
    });
    await sendEmail({
      to: user.email,
      subject: 'Welcome to Matcha',
      html: SignupMail({
        linkText: 'Confirm my account',
        link: `${
          env.NODE_ENV === 'DEV'
            ? `http://localhost:${env.CLIENT_PORT}/`
            : env.SERVER_URL
        }auth/confirm/${token}`,
      }),
    });

    const resendToken = jwt.sign({ id: user.id }, env.JWT_SECRET, {
      expiresIn: '5m',
    });

    res.status(201).json({
      message: 'Need to confirm your account',
      resendToken,
    });
    return;
  }

  const newToken = jwt.sign({ id: user.id }, env.JWT_SECRET, {
    expiresIn: 30 * 24 * 60 * 60,
  });

  return defaultResponse({
    res,
    status: 200,
    cookie: {
      name: AUTH_COOKIE_NAME,
      val: newToken,
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

export const resend = async (req: Request, res: Response) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: number;
    };

    const user = await db.user.findFirst({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      return defaultResponse({
        res,
        status: 401,
        json: { message: 'Unauthorized' },
      });
    }

    const newToken = jwt.sign({ id: user.id }, env.JWT_SECRET, {
      expiresIn: '5m',
    });

    await sendEmail({
      to: user.email,
      subject: 'Re: Login to Matcha',
      html: LoginMail({
        linkText: 'Log me in',
        link: `${
          env.NODE_ENV === 'DEV'
            ? `http://localhost:${env.CLIENT_PORT}`
            : env.SERVER_URL
        }/auth/confirm/${newToken}`,
      }),
    });

    return defaultResponse({
      res,
      status: 200,
      json: { message: 'Successfully resended confirmation email' },
    });
  } catch (_error) {
    return defaultResponse({
      res,
      status: 401,
      json: { message: 'Unauthorized' },
    });
  }
};
export const confirm = async (req: Request, res: Response) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: number;
    };

    const user = await db.user.findFirst({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      return defaultResponse({
        res,
        status: 401,
        json: { message: 'Unauthorized' },
      });
    }
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        isActivate: true,
      },
    });

    const newToken = jwt.sign({ id: decoded.id }, env.JWT_SECRET, {
      expiresIn: 30 * 24 * 60 * 60,
    });

    return defaultResponse({
      res,
      status: 200,
      cookie: {
        name: AUTH_COOKIE_NAME,
        val: newToken,
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
  } catch (_error) {
    return defaultResponse({
      res,
      status: 401,
      json: { message: 'Unauthorized' },
    });
  }
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
    const user = jwt.verify(token, env.JWT_SECRET) as {
      id: number;
    };
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });
    if (!dbUser) {
      return defaultResponse({
        res,
        status: 401,
        json: { message: 'Unauthorized' },
      });
    }

    const { password: _, ...userWithoutPassword } = dbUser;
    res
      .status(200)
      .json({ user: userWithoutPassword } as Infer<
        typeof sessionSchemas.response
      >);
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
