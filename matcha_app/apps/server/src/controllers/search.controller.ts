import { TAdvancedSearchSchema } from '@matcha/common';
import { Request, Response } from 'express';
import db from '../database/Database';
import { defaultResponse } from '../utils/defaultResponse';

export const advancedSearch = async (req: Request, res: Response) => {
  const { ages, fame, location, tags } =
    req.body as TAdvancedSearchSchema['requirements'];

  const dbLocation = await db.globalLocation.findFirst({
    where: {
      name: location,
    },
  });
  if (!dbLocation) {
    return defaultResponse({
      res,
      status: 404,
      json: {
        message: 'Location not found',
        fields: [{ field: 'location', message: 'Location not found' }],
      },
    });
  }
  const { latitude, longitude } = dbLocation;
  const locationDiff = 0.1;

  const goodLocations = await db.location.findMany({
    where: {
      latitude: {
        $gte: latitude - locationDiff,
        $lte: latitude + locationDiff,
      },
      longitude: {
        $gte: longitude - locationDiff,
        $lte: longitude + locationDiff,
      },
    },
  });

  const userLocations = await db.userLocation.findMany({
    where: {
      locationId: {
        $in: goodLocations.map((l) => l.id),
      },
    },
  });

  const users = await db.user.findMany({
    where: {
      id: {
        $in: userLocations.map((ul) => ul.userId),
      },
    },
  });

  console.log(users);
  res.status(200).json({ users });
};
