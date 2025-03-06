import { TCreatePictureSchemas, TGetPicturesSchemas } from '@matcha/common';
import { Request, Response } from 'express';
import fs from 'fs';
import { nanoid } from 'nanoid';
import path from 'path';
import sharp from 'sharp';
import db from '../database/Database';
import { defaultResponse } from '../utils/defaultResponse';

const PICTURES_DIR = path.join(__dirname, '../../private/pictures');

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
    const readResponse = fs.readFileSync(path.join(PICTURES_DIR, picture.url));
    res.status(200).json({
      id: +id,
      isProfile: picture.isProfile,
      file: {
        name: picture.url,
        type: 'image/webp',
        size: readResponse.length,
        buffer: Array.from(readResponse),
      },
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
  try {
    const files = pictures
      .map((picture) => {
        const picturePath = path.join(PICTURES_DIR, picture.url);
        const readResponse = fs.readFileSync(picturePath);
        return {
          id: picture.id,
          isProfile: picture.isProfile,
          file: {
            name: picture.url,
            type: 'image/webp',
            size: readResponse.length,
            buffer: Array.from(readResponse),
          },
        };
      })
      .filter(Boolean);

    res.status(200).json({
      pictures: files,
    });
  } catch (_error) {
    return defaultResponse({
      res,
      status: 404,
      json: { message: 'Failed to get pictures' },
    });
  }
};

export const createPicture = async (req: Request, res: Response) => {
  const { picture } = req.body as TCreatePictureSchemas['requirements'];
  const userId = req.user.id;
  const name = nanoid();

  try {
    const buffer = Buffer.from(picture.buffer);

    const imageInfo = await sharp(buffer).metadata();
    if (!imageInfo || !imageInfo.format) {
      return defaultResponse({
        res,
        status: 400,
        json: {
          message: 'Invalid image file',
          fields: [{ field: 'picture', message: 'Invalid image file' }],
        },
      });
    }

    await sharp(buffer)
      .webp({ quality: 80 })
      .toFile(path.join(PICTURES_DIR, `${name}.webp`));

    const pictures = await db.image.findMany({
      where: { userId },
    });

    if (pictures.length >= 5) {
      return defaultResponse({
        res,
        status: 400,
        json: {
          message: 'You can only have 5 pictures',
          fields: [
            { field: 'picture', message: 'You can only have 5 pictures' },
          ],
        },
      });
    }

    await db.image.create({
      data: {
        url: `${name}.webp`,
        userId,
        isProfile: pictures.length === 0,
      },
    });

    return defaultResponse({
      res,
      status: 201,
      json: { message: 'Picture created' },
    });
  } catch (error) {
    console.error('Error creating picture:', error);
    return defaultResponse({
      res,
      status: 500,
      json: {
        message: 'Failed to create picture',
        fields: [{ field: 'picture', message: 'Failed to process image' }],
      },
    });
  }
};
