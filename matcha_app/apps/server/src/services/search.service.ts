import { TGender, TOrientation, TUser } from '@matcha/common';
import db from '../database/Database';
import { WhereClause } from '../database/query/type';

export const fameCalculator = async (userId: TUser['id']) => {
  const likes = await db.like.findMany({
    where: {
      likedId: userId,
    },
  });
  const fame = Math.max(Math.min(Math.floor(likes.length / 5), 5), 1);

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
