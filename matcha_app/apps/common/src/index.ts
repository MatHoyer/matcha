// -----------------------Validator-----------------------
export { z, ZodType } from './validator';
export type { Infer } from './validator';

//-----------------------Get URL-----------------------
export { getServerUrl } from './getServer';
export { getUrl } from './getUrl';
export type {
  TApiRouteDataRequirements,
  TClientRouteDataRequirements,
} from './getUrl';

//-----------------------Datas-----------------------
export {
  AUTH_COOKIE_NAME,
  DECIMAL_SEPARATOR,
  EMPTY_FIND_SEARCH,
  GENDERS,
  ORIENTATIONS,
  THOUSAND_SEPARATOR,
} from './datas';

//-----------------------Utils-----------------------
export {
  capitalize,
  quoteUppercase,
  removeDuplicate,
  typedEntries,
  wait,
} from './utils';

//-----------------------Socket-----------------------
export { SOCKETS_EVENTS } from './sockets';

//-----------------------Schemas-----------------------
export {
  loginSchemas,
  logoutSchemas,
  sessionSchemas,
  signupSchemas,
} from './schemas/auth.schema';
export type {
  TLoginSchemas,
  TLogoutSchemas,
  TSessionSchemas,
  TSignupSchemas,
} from './schemas/auth.schema';
export {
  blockSchema,
  genderSchema,
  imageSchema,
  likeSchema,
  locationSchema,
  messageSchema,
  notificationSchema,
  orientationSchema,
  reportSchema,
  tagSchema,
  userSchema,
  userTagSchema,
  viewSchema,
} from './schemas/database.schema';
export type {
  TBlock,
  TGender,
  TImage,
  TLike,
  TLocation,
  TMessage,
  TNotification,
  TOrientation,
  TReport,
  TTag,
  TUser,
  TUserTag,
  TView,
} from './schemas/database.schema';
export { errorSchema } from './schemas/error.schema';
export type { TErrorSchema } from './schemas/error.schema';
export { getUserSchema } from './schemas/users.schema';

//-----------------------Errors-----------------------
export { SchemaError } from './errors/schema.error';
