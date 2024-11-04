export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export enum Orientation {
  Heterosexual = 'Heterosexual',
  Bisexual = 'Bisexual',
  Homosexual = 'Homosexual',
}

export type Tag = {
  id: number;
  name: string;
};

export type UserTag = {
  id: number;
  userId: number;
  tagId: number;
};

export type Message = {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  date: Date;
};

export type Report = {
  id: number;
  userId: number;
  reportedId: number;
  reason: string;
  date: Date;
};

export type Like = {
  id: number;
  userId: number;
  likedId: number;
  date: Date;
};

export type Notification = {
  id: number;
  userId: number;
  content: string;
  date: Date;
};

export type Block = {
  id: number;
  userId: number;
  blockedId: number;
  date: Date;
};

export type Location = {
  id: number;
  userId: number;
  latitude: number;
  longitude: number;
  date: Date;
};

export type View = {
  id: number;
  userId: number;
  viewedId: number;
  date: Date;
};

export type Image = {
  id: number;
  userId: number;
  url: string;
  isProfile: boolean;
};

export type User = {
  id: number;
  name: string;
  lastName: string;
  email: string;
  age: number;
  password: string;
  gender: Gender;
  preference: Orientation;
  biography?: string;
  lastTimeOnline?: Date;
};

export type UserIncludes = {
  userTag?: UserTag;
  message?: Message;
  report?: Report;
  like?: Like;
  notification?: Notification;
  block?: Block;
  location?: Location;
  view?: View;
  image?: Image;
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
  [P in keyof T]?: T[P] | { $gt?: T[P]; $lt?: T[P]; $gte?: T[P]; $lte?: T[P]; $not?: T[P] };
};
