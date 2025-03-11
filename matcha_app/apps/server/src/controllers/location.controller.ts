import { TUpdateLocationSchemas } from '@matcha/common';
import { differenceInDays } from 'date-fns';
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

export const isNeedUpdateLocation = async (req: Request, res: Response) => {
  const { id } = req.user;

  const userLocation = await db.userLocation.findFirst({
    where: {
      userId: id,
    },
  });

  if (!userLocation) {
    res.status(200).json({
      message: 'Needing update location',
      isNeedUpdate: true,
    });
    return;
  }

  const location = await db.location.findFirst({
    where: {
      id: userLocation.locationId,
    },
  });

  if (!location) {
    res.status(200).json({
      message: 'Needing update location',
      isNeedUpdate: true,
    });
    return;
  }

  if (differenceInDays(new Date(), location.date) >= 1) {
    res.status(200).json({
      message: 'Needing update location',
      isNeedUpdate: true,
    });
    return;
  }

  res.status(200).json({
    message: 'Location is up to date',
    isNeedUpdate: false,
  });
};
