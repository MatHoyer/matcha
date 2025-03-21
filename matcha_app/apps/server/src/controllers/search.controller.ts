import { batchPromises, TAdvancedSearchSchema } from '@matcha/common';
import { Request, Response } from 'express';
import db from '../database/Database';
import {
  fameCalculator,
  getGenderPreferenceMatchCondition,
} from '../services/search.service';
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

  const goodTags = await db.tag.findMany({
    where: {
      name: {
        $in: tags,
      },
    },
  });
  const userTags = await db.userTag.findMany({
    where: {
      tagId: {
        $in: goodTags.map((t) => t.id),
      },
    },
  });

  let ids = [
    ...new Set([
      ...userTags.map((ut) => ut.userId),
      ...userLocations.map((ul) => ul.userId),
    ]),
  ];

  const fameResults = await batchPromises(ids.map((id) => fameCalculator(id)));
  ids = ids.filter((id) => {
    const fameResult = fameResults.find((f) => f.userId === id)?.fame;
    return fameResult ? fameResult >= fame : false;
  });

  const likedUsers = await db.like.findMany({
    where: {
      userId: req.user.id,
    },
  });

  const users = await db.user.findMany({
    where: {
      id: {
        $in: ids,
      },
      NOT: [
        {
          id: {
            $in: [req.user.id, ...likedUsers.map((l) => l.likedId)],
          },
        },
      ],
      age: {
        $gte: ages.min,
        $lte: ages.max,
      },
      OR: getGenderPreferenceMatchCondition(
        req.user.gender,
        req.user.preference
      ),
    },
  });

  const usersResponse: TAdvancedSearchSchema['response']['users'] =
    await batchPromises(
      users.map(async (user) => {
        const allUserTags = await db.userTag.findMany({
          where: {
            userId: user.id,
          },
        });
        const allTags = await db.tag.findMany({
          where: {
            id: {
              $in: allUserTags.map((ut) => ut.tagId),
            },
          },
        });

        return {
          user: user,
          tags: allTags as { id: number; name: string }[],
          fame: fameResults.find((f) => f.userId === user.id)?.fame || 1,
          location,
        };
      })
    );

  res.status(200).json({ users: usersResponse });
};
