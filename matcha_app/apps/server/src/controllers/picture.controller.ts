import { TCreatePictureSchemas, TGetPicturesSchemas } from '@matcha/common';
import { Request, Response } from 'express';
import fs from 'fs';
import { nanoid } from 'nanoid';
import sharp from 'sharp';
import db from '../database/Database';
import { defaultResponse } from '../utils/defaultResponse';

export const getPicture = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const picture = await db.image.findFirst({
      where: {
        id: +id,
      },
    });
    if (!picture) {
      return defaultResponse({
        res,
        status: 404,
        json: { message: 'Picture not found' },
      });
    }
    fs.readFile(`../private/pictures/${picture.url}`, (err, data) => {
      if (err) {
        return defaultResponse({
          res,
          status: 404,
          json: { message: 'Picture not found' },
        });
      }
      const file = new File([data], picture.url, { type: 'image/webp' });
      res.status(200).json({ id: +id, isProfile: picture.isProfile, file });
    });
  } catch (_error) {
    return defaultResponse({
      res,
      status: 404,
      json: { message: 'Picture not found' },
    });
  }
};

export const getPictures = async (req: Request, res: Response) => {
  const { userId } = req.body as TGetPicturesSchemas['requirements'];
  const pictures = await db.image.findMany({
    where: {
      userId,
    },
  });
  const files = pictures.map((picture) => {
    const path = `../private/pictures/${picture.url}`;
    const file = fs.readFile(path, (err, data) => {
      if (err) {
        return defaultResponse({
          res,
          status: 404,
          json: { message: 'Picture not found' },
        });
      }
      return new File([data], path, { type: 'image/webp' });
    });
    return { id: picture.id, isProfile: picture.isProfile, file };
  });

  res.status(200).json({
    pictures: files,
  });
};
export const createPicture = async (req: Request, res: Response) => {
  const { picture } = req.body as TCreatePictureSchemas['requirements'];
  const userId = req.user.id;
  const name = nanoid();

  try {
    const buffer = Buffer.from(await picture.arrayBuffer());
    sharp(buffer).toFile(`../private/pictures/${name}.webp`);
    const pictures = await db.image.findMany({
      where: {
        userId,
      },
    });
    if (pictures.length >= 5) {
      throw new Error('You can only have 5 pictures');
    }
    await db.image.create({
      data: {
        url: name,
        userId,
        isProfile: pictures.length === 0,
      },
    });

    defaultResponse({
      res,
      status: 201,
      json: { message: 'Picture created' },
    });
  } catch (_error) {
    defaultResponse({
      res,
      status: 500,
      json: { message: 'Failed to create picture' },
    });
  }
};
