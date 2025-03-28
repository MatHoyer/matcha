import {
  batchPromises,
  TAdvancedSearchSchema,
  TLocation,
} from '@matcha/common';
import { Request, Response } from 'express';
import db from '../database/Database';
import {
  fameCalculator,
  getGenderPreferenceMatchCondition,
} from '../services/search.service';
import { defaultResponse } from '../utils/defaultResponse';
import { TUser } from '@matcha/common';

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
      userId: {
        $in: userLocations.map((ul) => ul.userId),
      },
    },
  });

  let ids = [
    ...new Set([
      ...(tags.length === 0
        ? userLocations.map((ul) => ul.userId)
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

export const suggestedUsers = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user = await db.user.findMany({
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
    // we want to send back a list of 50 suggested users that are not the user itself
    // the closest to the user location (priority)
    // the most common tags
    // a maximum of fame
    const location = await db.location.findFirst({
      where: {
        id: +id,
      },
    });
    console.log('location :', location);
    const latitude = location?.latitude as number;
    const longitude = location?.longitude as number;
    let locationDiff = 0.1;
    let goodLocations = [] as TLocation[];
    while (goodLocations.length < 30) {
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
    let ids = [...new Set(goodLocations.map((l) => l.id))];
    console.log('ids :', ids);
    const likedUsers = await db.like.findMany({
      where: {
        userId: +id,
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
        OR: getGenderPreferenceMatchCondition(
          req.user.gender,
          req.user.preference
        ),
      },
    });
    console.log('users :', users);

    // first sort by fame
    const fameResults = await batchPromises(
      ids.map((id) => fameCalculator(id))
    );
    console.log('fameResults :', fameResults);
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
          const userLocation = await db.location.findFirst({
            where: {
              id: user.id,
            },
          });
          const allLocations = await db.globalLocation.findMany({});
          const locationName = allLocations.find(
            (gl) =>
              gl.latitude === userLocation?.latitude &&
              gl.longitude === userLocation?.longitude
          )?.name;

          return {
            user: user,
            tags: allTags as { id: number; name: string }[],
            fame: fameResults.find((f) => f.userId === user.id)?.fame || 1,
            location: locationName || 'Unknown',
          };
        })
      );
    res.status(200).json({ users: usersResponse });
  } catch (error) {
    defaultResponse({
      res,
      status: 500,
      json: { message: 'Internal Server Error' },
    });
  }
};
