import {
  blockSchema,
  imageSchema,
  likeSchema,
  locationSchema,
  messageSchema,
  notificationSchema,
  reportSchema,
  tagSchema,
  TBlock,
  TImage,
  TLike,
  TLocation,
  TMessage,
  TNotification,
  TReport,
  TUserTag,
  TView,
  userSchema,
  userTagSchema,
  viewSchema,
  ZodObject,
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

// eslint-disable-next-line
const transformSchema = (schema: ZodObject<any>) => {
  return Object.keys(schema.shape).reduce(
    (acc, key) => ({
      ...acc,
      [key]: key,
    }),
    {} as Record<string, string>
  );
};

export const tableKeys: Record<string, Record<string, string>> = {
  user: transformSchema(userSchema),
  tag: transformSchema(tagSchema),
  userTag: transformSchema(userTagSchema),
  message: transformSchema(messageSchema),
  report: transformSchema(reportSchema),
  like: transformSchema(likeSchema),
  notification: transformSchema(notificationSchema),
  block: transformSchema(blockSchema),
  location: transformSchema(locationSchema),
  view: transformSchema(viewSchema),
  image: transformSchema(imageSchema),
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
