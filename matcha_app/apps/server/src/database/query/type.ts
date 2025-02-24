import {
  TBlock,
  TImage,
  TLike,
  TLocation,
  TMessage,
  TNotification,
  TReport,
  TUserTag,
  TView,
} from '@matcha/common';

export type UserIncludes = {
  userTag?: TUserTag;
  message?: TMessage;
  report?: TReport;
  like?: TLike;
  notification?: TNotification;
  block?: TBlock;
  location?: TLocation;
  view?: TView;
  image?: TImage;
};

export const tableAlias: Record<string, string> = {
  user: 'a',
  userTag: 'b',
  message: 'c',
  report: 'd',
  like: 'e',
  notification: 'f',
  block: 'g',
  location: 'h',
  view: 'i',
  image: 'j',
};

export const tableKeys: Record<string, Record<string, string>> = {
  user: {
    id: 'id',
    name: 'name',
    lastName: 'lastName',
    email: 'email',
    age: 'age',
    password: 'password',
    gender: 'gender',
    preference: 'preference',
    biography: 'biography',
    lastTimeOnline: 'lastTimeOnline',
  },
  userTag: {
    id: 'id',
    userId: 'userId',
    tagId: 'tagId',
  },
  message: {
    id: 'id',
    senderId: 'senderId',
    receiverId: 'receiverId',
    content: 'content',
    date: 'date',
  },
  report: {
    id: 'id',
    userId: 'userId',
    reportedId: 'reportedId',
    reason: 'reason',
    date: 'date',
  },
  like: {
    id: 'id',
    userId: 'userId',
    likedId: 'likedId',
    date: 'date',
  },
  notification: {
    id: 'id',
    userId: 'userId',
    content: 'content',
    date: 'date',
  },
  block: {
    id: 'id',
    userId: 'userId',
    blockedId: 'blockedId',
    date: 'date',
  },
  location: {
    id: 'id',
    userId: 'userId',
    latitude: 'latitude',
    longitude: 'longitude',
    date: 'date',
  },
  view: {
    id: 'id',
    userId: 'userId',
    viewedId: 'viewedId',
    date: 'date',
  },
  image: {
    id: 'id',
    userId: 'userId',
    url: 'url',
    isProfile: 'isProfile',
  },
};

export type Select<T> = {
  [P in keyof T]?: boolean;
};

export type Include<T> = {
  [P in keyof T]?: boolean | { select?: Select<T[P]> };
};

export type OrderBy<T> = {
  [P in keyof T]?: 'asc' | 'desc';
};

export type WhereClause<T> = {
  [P in keyof T]?:
    | T[P]
    | { $gt?: T[P]; $lt?: T[P]; $gte?: T[P]; $lte?: T[P]; $not?: T[P] };
};

export type CommonOptions<T, I> = {
  where?: WhereClause<T>;
  include?: Include<I>;
  select?: Select<T>;
  take?: number;
  skip?: number;
};
