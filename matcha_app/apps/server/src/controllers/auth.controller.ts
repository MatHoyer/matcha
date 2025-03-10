import {
  AUTH_COOKIE_NAME,
  Infer,
  sessionSchemas,
  TGender,
  TLoginSchemas,
  TOrientation,
  TSignupSchemas,
  wait,
  z,
} from '@matcha/common';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../database/Database.js';
import { LoginMail } from '../emails/patterns/LoginMail/LoginMail.js';
import { SignupMail } from '../emails/patterns/SignupMail/SignupMail.js';
import { sendEmail } from '../emails/sendEmail.js';
import { env } from '../env.js';
import { hashPassword } from '../services/auth.service.js';
import { defaultResponse } from '../utils/defaultResponse.js';

export const signup = async (req: Request, res: Response) => {
  const { password, gender, preference, ...userData } =
    req.body as TSignupSchemas['requirements'];

  const passwordSchema = z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    );
  if (!passwordSchema.safeParse(password).success) {
    return defaultResponse({
      res,
      status: 400,
      json: {
        message: 'Invalid password',
        fields: [
          {
            field: 'password',
            message:
              'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character',
          },
        ],
      },
    });
  }

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

  const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
    expiresIn: '5m',
  });

  await sendEmail({
    to: user.email,
    subject: 'Welcome to Matcha',
    html: SignupMail({
      linkText: 'Confirm my signup',
      link: `${
        env.NODE_ENV === 'DEV'
          ? `http://localhost:${env.CLIENT_PORT}`
          : env.SERVER_URL
      }/auth/confirm/${token}`,
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

  const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
    expiresIn: '5m',
  });

  await sendEmail({
    to: user.email,
    subject: 'Login to Matcha',
    html: LoginMail({
      linkText: 'Log me in',
      link: `${
        env.NODE_ENV === 'DEV'
          ? `http://localhost:${env.CLIENT_PORT}`
          : env.SERVER_URL
      }/auth/confirm/${token}`,
    }),
  });

  const resendToken = jwt.sign({ id: user.id }, env.JWT_SECRET, {
    expiresIn: '5m',
  });

  res.status(200).json({
    message: 'Successfully logged in',
    resendToken,
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
