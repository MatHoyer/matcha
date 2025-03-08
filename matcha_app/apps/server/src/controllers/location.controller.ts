import { TUpdateLocationSchemas } from '@matcha/common';
import { Request, Response } from 'express';
import db from '../database/Database';
import { defaultResponse } from '../utils/defaultResponse';

export const updateLocation = async (req: Request, res: Response) => {
  const { latitude, longitude } =
    req.body as TUpdateLocationSchemas['requirements'];

  const { id } = req.user;

  const userLocation = await db.userLocation.findFirst({
    where: {
      userId: id,
    },
  });

  if (!userLocation) {
    const location = await db.location.create({
      data: {
        latitude,
        longitude,
        date: new Date(),
      },
    });
    if (!location) {
      return defaultResponse({
        res,
        status: 400,
        json: {
          message: 'Location not created',
        },
      });
    }
    await db.userLocation.create({
      data: {
        userId: id,
        locationId: location.id,
      },
    });
    return defaultResponse({
      res,
      status: 200,
      json: {
        message: 'Location updated',
      },
    });
  }

  await db.location.update({
    where: {
      id: userLocation.locationId,
    },
    data: {
      latitude,
      longitude,
      date: new Date(),
    },
  });

  return defaultResponse({
    res,
    status: 200,
    json: {
      message: 'Location updated',
    },
  });
};
