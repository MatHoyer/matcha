import { createTagSchemas, Infer } from '@matcha/common';
import { Request, Response } from 'express';
import db from '../database/Database';
import { defaultResponse } from '../utils/defaultResponse';

export const getTags = async (_req: Request, res: Response) => {
  const tags = await db.tag.findMany({});

  res.status(200).json({ tags });
};

export const createTag = async (req: Request, res: Response) => {
  const { tag } = req.body as Infer<typeof createTagSchemas.requirements>;

  const newTag = await db.tag.create({
    data: {
      name: tag,
    },
  });
  if (!newTag) {
    return defaultResponse({
      res,
      status: 409,
      json: {
        message: 'Existing tag',
        fields: [{ field: 'name', message: 'This tag already exist' }],
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
