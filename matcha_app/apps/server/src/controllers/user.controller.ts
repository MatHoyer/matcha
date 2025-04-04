import {
  AUTH_COOKIE_NAME,
  getUsersSchemas,
  Infer,
  TResetPasswordSchemas,
  TUpdateUserSchemas,
  z,
} from '@matcha/common';
import { setHours } from 'date-fns';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../database/Database';
import { ResetPasswordMail } from '../emails/patterns/ResetPasswordMail';
import { sendEmail } from '../emails/sendEmail';
import { env } from '../env';
import { hashPassword } from '../services/auth.service';
import { fameCalculator } from '../services/search.service';
import { defaultResponse } from '../utils/defaultResponse';

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({});
    if (!users) {
      return defaultResponse({
        res,
        status: 404,
        json: {
          message: 'User not found',
        },
      });
    }
    const usersWithoutPassword = users.map((user) => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res
      .status(200)
      .json({ users: usersWithoutPassword } as Infer<
        typeof getUsersSchemas.response
      >);
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
    const userWithoutPassword = { ...user, password: undefined };
    res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Error fetching user:', error);
    defaultResponse({
      res,
      status: 500,
      json: { message: 'Internal Server Error' },
    });
  }
};

export const getMatchUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const likes = await db.like.findMany({
      where: {
        OR: [{ userId: +id }, { likedId: +id }],
      },
    });
    const matchIds = likes
      .filter((like) =>
        likes.find(
          (l) =>
            l.userId === like.likedId &&
            l.likedId === like.userId &&
            l.userId !== l.likedId
        )
      )
      .map((like) => (like.userId === +id ? like.likedId : like.userId));
    const users = await db.user.findMany({
      where: {
        id: { $in: matchIds },
      },
    });
    res.status(200).json({ users });
  } catch (_error) {
    defaultResponse({
      res,
      status: 500,
      json: { message: 'Internal Server Error' },
    });
  }
};

export const haveMatched = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const like = await db.like.findFirst({
    where: {
      userId: +userId,
      likedId: req.user.id,
    },
  });
  const likeOtherUser = await db.like.findFirst({
    where: {
      userId: req.user.id,
      likedId: +userId,
    },
  });
  res.status(200).json({ matched: !!(like && likeOtherUser) });
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

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

  const userTags = await db.userTag.findMany({
    where: {
      userId: +id,
    },
  });
  const tagIds = userTags.map((userTag) => userTag.tagId);
  const tags = await db.tag.findMany({
    where: {
      id: { $in: tagIds },
    },
  });
  const allTags = await db.tag.findMany({});

  const { tags: newTags } = req.body as TUpdateUserSchemas['requirements'];
  const tagsToRemove = tags.filter((tag) => !newTags.includes(tag.name));
  const tagsToAdd = newTags
    .filter((tag) => !tags.map((t) => t.name).includes(tag))
    .map((tag) => allTags.find((t) => t.name === tag))
    .filter((tag) => tag !== undefined);

  console.log(tagsToRemove, tagsToAdd);
  for (const tag of tagsToRemove) {
    await db.userTag.remove({
      where: {
        userId: +id,
        tagId: tag.id,
      },
    });
  }
  for (const tag of tagsToAdd) {
    await db.userTag.create({
      data: {
        userId: +id,
        tagId: tag.id,
      },
    });
  }

  const { location } = req.body as TUpdateUserSchemas['requirements'];
  const globalLocation = await db.globalLocation.findFirst({
    where: {
      name: location,
    },
  });
  if (!globalLocation) {
    return defaultResponse({
      res,
      status: 404,
      json: {
        message: 'Location not found',
        fields: [{ field: 'location', message: 'Location not found' }],
      },
    });
  }

  await db.location.update({
    where: { id: +id },
    data: {
      latitude: globalLocation.latitude,
      longitude: globalLocation.longitude,
      date: new Date(),
    },
  });

  const { name, lastName, email, gender, preference, birthDate, biography } =
    req.body as TUpdateUserSchemas['requirements'];
  await db.user.update({
    where: {
      id: +id,
    },
    data: {
      name,
      lastName,
      email,
      gender,
      preference,
      birthDate: setHours(birthDate, 3),
      biography,
    },
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

export const getUserFame = async (req: Request, res: Response) => {
  const { id } = req.params;
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

  const userFame = await fameCalculator(user.id);

  res.status(200).json({ fame: userFame.fame });
};

export const askResetPassword = async (req: Request, res: Response) => {
  console.log(req.user);

  const user = await db.user.findFirst({
    where: {
      id: req.user.id,
    },
  });
  if (!user) {
    return defaultResponse({
      res,
      status: 404,
      json: { message: 'User not found' },
    });
  }

  const token = jwt.sign({ ...user }, env.JWT_SECRET, {
    expiresIn: 30 * 24 * 60 * 60,
  });

  await sendEmail({
    to: user.email,
    subject: 'Reset password',
    html: ResetPasswordMail({
      link: `${
        env.NODE_ENV === 'DEV'
          ? `http://localhost:${env.CLIENT_PORT}/`
          : env.SERVER_URL
      }reset-password/${token}`,
      linkText: 'Reset password',
    }),
  });

  return defaultResponse({
    res,
    status: 200,
    json: { message: 'Reset password token sent to email' },
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { password } = req.body as TResetPasswordSchemas['requirements'];

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

  await db.user.update({
    where: {
      id: req.user.id,
    },
    data: { password: hashedPassword },
  });

  return defaultResponse({
    res,
    status: 200,
    json: { message: 'Password reset successfully' },
  });
};

export const isBlocked = async (req: Request, res: Response) => {
  const { id } = req.params;
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

  const blocked = await db.block.findFirst({
    where: {
      userId: req.user.id,
      blockedId: +id,
    },
  });

  res.status(200).json({ blocked: !!blocked });
};
