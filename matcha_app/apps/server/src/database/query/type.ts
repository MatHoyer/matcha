import {
  blockSchema,
  globalLocationSchema,
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
  TMessage,
  TNotification,
  TReport,
  TUser,
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
  view?: TView;
  image?: TImage;
};

export type NotificationIncludes = {
  otherUser?: TUser;
};

export const tableAlias: Record<string, string> = {
  user: 'u',
  tag: 't',
  userTag: 'ut',
  message: 'm',
  report: 'r',
  like: 'li',
  notification: 'n',
  block: 'b',
  globalLocation: 'gl',
  location: 'lo',
  view: 'v',
  image: 'i',
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
  globalLocation: transformSchema(globalLocationSchema),
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

type WhereClauseObject<T> = {
  [P in keyof T]?:
    | T[P]
    | {
        $gt?: T[P];
        $lt?: T[P];
        $gte?: T[P];
        $lte?: T[P];
        $not?: T[P];
        $in?: T[P][];
      };
};

export type WhereClause<T> = {
  AND?: WhereClause<T>[];
  OR?: WhereClause<T>[];
  NOT?: WhereClause<T>[];
} & WhereClauseObject<T>;

export type CommonOptions<T, I> = {
  where?: WhereClause<T>;
  include?: Include<I>;
  select?: Select<T>;
  take?: number;
  skip?: number;
  orderBy?: OrderBy<T>;
};
