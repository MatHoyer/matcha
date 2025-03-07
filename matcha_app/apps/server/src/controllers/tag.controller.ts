import { createTagSchemas, Infer } from '@matcha/common';
import { Request, Response } from 'express';
import db from '../database/Database';
import { defaultResponse } from '../utils/defaultResponse';

export const getTags = async (_req: Request, res: Response) => {
  const tags = await db.tag.findMany({});

  res.status(200).json({ tags });
};

export const createTag = async (req: Request, res: Response) => {
  const { name } = req.body as Infer<typeof createTagSchemas.requirements>;

  const existingTag = await db.tag.findFirst({
    where: {
      name,
    },
  });
  if (existingTag) {
    return defaultResponse({
      res,
      status: 409,
      json: {
        message: 'Existing tag',
        fields: [{ field: 'name', message: 'This tag already exist' }],
      },
    });
  }

  const newTag = await db.tag.create({
    data: {
      name,
    },
  });
  if (!newTag) {
    return defaultResponse({
      res,
      status: 400,
      json: {
        message: 'Error creating tag',
      },
    });
  }

  return defaultResponse({
    res,
    status: 201,
    json: {
      message: 'Tag created',
    },
  });
};

export const getUserTags = async (req: Request, res: Response) => {
  const { id } = req.params;

  const userTags = await db.userTag.findMany({
    where: {
      userId: +id,
    },
  });

  const tags = await db.tag.findMany({
    where: {
      id: {
        $in: userTags.map((tag) => tag.tagId),
      },
    },
  });

  res.status(200).json({ tags });
};
