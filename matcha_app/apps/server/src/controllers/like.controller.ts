import { TCreateLikeSchemas, TDeleteLikeSchemas } from '@matcha/common';
import { Request, Response } from 'express';
import db from '../database/Database';
import { defaultResponse } from '../utils/defaultResponse';

export const isLiked = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const like = await db.like.findFirst({
    where: {
      userId,
      likedId: +id,
    },
  });
  console.log('--> like in isLiked', like);
  res.status(200).json({ isLiked: !!like });
};

export const likesMe = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  console.log('--> id', id);
  console.log('--> userId', userId);

  const like = await db.like.findFirst({
    where: {
      userId: +id,
      likedId: userId,
    },
  });
  console.log('--> like in likesMe', like);
  res.status(200).json({ isLiked: !!like });
};

export const createLike = async (req: Request, res: Response) => {
  const { likedId } = req.body as TCreateLikeSchemas['requirements'];
  const { id } = req.user;

  const like = await db.like.create({
    data: {
      likedId,
      userId: id,
    },
  });
  if (!like) {
    return defaultResponse({
      res,
      status: 400,
      json: {
        message: 'Like not created',
      },
    });
  }

  return defaultResponse({
    res,
    status: 200,
    json: {
      message: 'Like created',
    },
  });
};

export const deleteLike = async (req: Request, res: Response) => {
  const { likedId } = req.body as TDeleteLikeSchemas['requirements'];
  const { id } = req.user;

  const like = await db.like.remove({
    where: {
      userId: id,
      likedId,
    },
  });
  if (!like) {
    return defaultResponse({
      res,
      status: 400,
      json: {
        message: 'Like not deleted',
      },
    });
  }

  return defaultResponse({
    res,
    status: 200,
    json: { message: 'Like deleted' },
  });
};
