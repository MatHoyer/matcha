import {
  batchPromises,
  TAdvancedSearchSchema,
  TForYouSchema,
  TLocation,
} from '@matcha/common';
import { Request, Response } from 'express';
import db from '../database/Database';
import {
  fameCalculator,
  findClosestLocation,
  getGenderPreferenceMatchCondition,
} from '../services/search.service';
import { defaultResponse } from '../utils/defaultResponse';

export const advancedSearch = async (req: Request, res: Response) => {
  const { ages, fame, location, tags } =
    req.body as TAdvancedSearchSchema['requirements'];
  console.log('location here :', location);
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
  let locationDiff = 0.1;
  let goodLocations = [] as TLocation[];
  while (goodLocations.length === 0 && locationDiff < 0.5) {
    goodLocations = await db.location.findMany({
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
    locationDiff += 0.1;
  }

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
      userId: {
        $in: goodLocations.map((l) => l.id),
      },
    },
  });

  let ids = [
    ...new Set([
      ...(tags.length === 0
        ? goodLocations.map((l) => l.id)
        : userTags.map((ut) => ut.userId)),
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

  const blockedUsers = await db.block.findMany({
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
            $in: [
              req.user.id,
              ...likedUsers.map((l) => l.likedId),
              ...blockedUsers.map((bu) => bu.blockedId),
            ],
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

  const usersResponse: (
    | TAdvancedSearchSchema['response']['users'][number]
    | null
  )[] = await batchPromises(
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

      const userLocation = await db.location.findFirst({
        where: {
          id: user.id,
        },
      });
      if (!userLocation) {
        return null;
      }

      const allLocations = await db.globalLocation.findMany({});
      const goodLocation = findClosestLocation(userLocation, allLocations);
      const locationName = allLocations.find(
        (gl) =>
          gl.latitude === goodLocation?.latitude &&
          gl.longitude === goodLocation?.longitude
      )?.name;

      return {
        user: user,
        // user: { ...user, age: 30 },
        tags: allTags as { id: number; name: string }[],
        // fame: fameResults.find((f) => f.userId === user.id)?.fame || 1,
        fame: Math.floor(Math.random() * 5),
        location: locationName || 'Unknown',
      };
    })
  );

  res.status(200).json({ users: usersResponse.filter((u) => u) });
};

export const suggestedUsers = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await db.user.findFirst({
    where: {
      id: +id,
    },
  });
  if (!user) {
    return defaultResponse({
      res,
      status: 404,
      json: {
        message: 'User not found',
      },
    });
  }
  const location = await db.location.findFirst({
    where: {
      id: +id,
    },
  });
  if (!location) {
    return defaultResponse({
      res,
      status: 404,
      json: {
        message: 'Location not found',
      },
    });
  }
  const latitude = location.latitude;
  const longitude = location.longitude;
  let locationDiff = 0.1;
  let goodLocations = [] as TLocation[];
  while (goodLocations.length < 30 && locationDiff < 1.5) {
    goodLocations = await db.location.findMany({
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
    locationDiff += 0.1;
  }
  const ids = [...new Set(goodLocations.map((l) => l.id))];
  const likedUsers = await db.like.findMany({
    where: {
      userId: +id,
    },
  });
  const blockedUsers = await db.block.findMany({
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
            $in: [
              req.user.id,
              ...likedUsers.map(
                (l) => l.likedId,
                ...blockedUsers.map((bu) => bu.blockedId)
              ),
            ],
          },
        },
      ],
      OR: getGenderPreferenceMatchCondition(
        req.user.gender,
        req.user.preference
      ),
    },
  });
  const usersWithOrderLoc = users.map((user, index) => ({
    user,
    order: index + 1,
  }));

  console.log('usersWithOrderLoc :', usersWithOrderLoc);
  const fameResults = await batchPromises(ids.map((id) => fameCalculator(id)));
  // console.log('fameResults :', fameResults);
  const usersResponse: (TForYouSchema['response']['users'][number] | null)[] =
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
        const location = await db.location.findFirst({
          where: {
            id: user.id,
          },
        });
        if (!location) {
          return null;
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
          return null;
        }
        const locationName = globalLocations.find(
          (gl) =>
            gl.latitude === globalLocationsNear.latitude &&
            gl.longitude === globalLocationsNear.longitude
        )?.name;
        const sessionUser = req.user;
        const tagsSessionUser = await db.userTag.findMany({
          where: {
            userId: sessionUser.id,
          },
        });
        const tagIdsInSessionUser = new Set(
          tagsSessionUser.map((tag) => tag.tagId)
        );
        const similarTagsCount = allTags.filter((tag) =>
          tagIdsInSessionUser.has(tag.id)
        ).length;
        // console.log('similarTagsCount :', similarTagsCount);

        // const locationOrder =
        const sortedLocationNames = globalLocations
          .map((gl) => gl.name)
          .sort((a, b) => a.localeCompare(b));
        const locationOrder =
          sortedLocationNames.indexOf(locationName || 'Unknown') + 1;
        return {
          user,
          tags: { names: allTags, order: similarTagsCount },
          fame: fameResults.find((f) => f.userId === user.id)?.fame || 1,
          location: { name: locationName || 'Unknown', order: locationOrder },
        };
      })
    );

  res.status(200).json({ users: usersResponse.filter((u) => u) });
};
