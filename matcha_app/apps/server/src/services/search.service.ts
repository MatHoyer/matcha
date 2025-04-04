import { TGender, TOrientation, TUser } from '@matcha/common';
import db from '../database/Database';
import { WhereClause } from '../database/query/type';

export const fameCalculator = async (userId: TUser['id']) => {
  const likes = await db.like.findMany({
    where: {
      likedId: userId,
    },
  });
  const fame = Math.max(Math.min(Math.floor(likes.length / 5), 5), 0) + 1;

  return { userId, fame };
};

export const getGenderPreferenceMatchCondition = (
  gender: TGender,
  preference: TOrientation
) => {
  let matchConditions = [] as WhereClause<TUser>[];

  if (preference === 'Heterosexual') {
    matchConditions = [
      {
        gender: gender === 'Male' ? 'Female' : 'Male',
        preference: { $in: ['Heterosexual', 'Bisexual'] },
      },
    ];
  } else if (preference === 'Homosexual') {
    matchConditions = [
      { gender, preference: { $in: ['Homosexual', 'Bisexual'] } },
    ];
  } else if (preference === 'Bisexual') {
    matchConditions = [
      {
        gender: gender,
        preference: { $in: ['Bisexual', 'Homosexual'] },
      },
      {
        gender: gender === 'Male' ? 'Female' : 'Male',
        preference: { $in: ['Bisexual', 'Heterosexual'] },
      },
    ];
  }
  return matchConditions;
};

export const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRad = (angle: number) => (Math.PI / 180) * angle;

  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; //km
};

type Location = { latitude: number; longitude: number };

export const findClosestLocation = (
  target: Location,
  locations: Location[]
): Location | null => {
  if (locations.length === 0) return null;

  return locations.reduce((closest, location) =>
    haversineDistance(
      target.latitude,
      target.longitude,
      location.latitude,
      location.longitude
    ) <
    haversineDistance(
      target.latitude,
      target.longitude,
      closest.latitude,
      closest.longitude
    )
      ? location
      : closest
  );
};
