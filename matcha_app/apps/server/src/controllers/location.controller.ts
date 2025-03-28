import { TUpdateLocationSchemas } from '@matcha/common';
import { differenceInDays } from 'date-fns';
import { Request, Response } from 'express';
import db from '../database/Database';
import { findClosestLocation } from '../services/search.service';
import { defaultResponse } from '../utils/defaultResponse';

export const updateLocation = async (req: Request, res: Response) => {
  const { latitude, longitude } =
    req.body as TUpdateLocationSchemas['requirements'];

  const { id } = req.user;

  let location = await db.location.findFirst({
    where: {
      id: id,
    },
  });
  if (!location) {
    location = await db.location.create({
      data: {
        latitude,
        longitude,
        date: new Date(),
      },
    });
    return defaultResponse({
      res,
      status: location ? 200 : 400,
      json: {
        message: location ? 'Location updated' : 'Location not created',
      },
    });
  }

  await db.location.update({
    where: {
      id: location.id,
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

  const location = await db.location.findFirst({
    where: {
      id: id,
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

export const getUserNearLocation = async (req: Request, res: Response) => {
  const { id } = req.params;

  const location = await db.location.findFirst({
    where: {
      id: +id,
    },
  });
  if (!location) {
    return defaultResponse({
      res,
      status: 400,
      json: {
        message: 'Location not found',
      },
    });
  }

  const globalLocations = await db.globalLocation.findMany({});
  const globalLocationsNear = findClosestLocation(
    {
      latitude: location.latitude,
      longitude: location.longitude,
    },
    globalLocations.map((gl) => ({
      latitude: gl.latitude,
      longitude: gl.longitude,
    }))
  );

  if (!globalLocationsNear) {
    return defaultResponse({
      res,
      status: 400,
      json: {
        message: 'No global locations near',
      },
    });
  }

  const locationName = globalLocations.find(
    (gl) =>
      gl.latitude === globalLocationsNear.latitude &&
      gl.longitude === globalLocationsNear.longitude
  )?.name;

  if (!locationName) {
    return defaultResponse({
      res,
      status: 400,
      json: {
        message: 'Location not found',
      },
    });
  }

  res.status(200).json({
    location: {
      name: locationName,
    },
  });
};
