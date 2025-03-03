// -----------------------Validator-----------------------
export {
  z,
  ZodArray,
  ZodBoolean,
  ZodDate,
  ZodEnum,
  ZodNull,
  ZodNumber,
  ZodObject,
  ZodString,
  ZodType,
  ZodUnion,
} from './validator/validator';
export type { Infer } from './validator/validator';

//-----------------------Utils-----------------------
export {
  AUTH_COOKIE_NAME,
  DECIMAL_SEPARATOR,
  EMPTY_FIND_SEARCH,
  GENDERS,
  ORIENTATIONS,
  PROMISE_BATCH_SIZE,
  THOUSAND_SEPARATOR,
} from './utils/datas';
export { getDateAsString, getNearDate } from './utils/date';
export { getServerUrl } from './utils/getServer';
export { getUrl } from './utils/getUrl';
export type {
  TApiRouteDataRequirements,
  TClientRouteDataRequirements,
} from './utils/getUrl';
export {
  batchPromises,
  capitalize,
  containsUpperCase,
  quoteUppercase,
  removeDuplicate,
  typedEntries,
  wait,
} from './utils/utils';

//-----------------------Socket-----------------------
export { SOCKETS_EVENTS } from './sockets/sockets';

//-----------------------Schemas-----------------------
export {
  loginSchemas,
  logoutSchemas,
  sessionSchemas,
  signupSchemas,
} from './schemas/api/auth.schema';
export type {
  TLoginSchemas,
  TLogoutSchemas,
  TSessionSchemas,
  TSignupSchemas,
} from './schemas/api/auth.schema';
export { errorSchema } from './schemas/api/error.schema';
export type { TErrorSchema } from './schemas/api/error.schema';
export { getGlobalLocationsSchemas } from './schemas/api/globalLocations.schema';
export type { TGlobalLocationsSchemas } from './schemas/api/globalLocations.schema';
export { advancedSearchSchema } from './schemas/api/search.schema';
export type { TAdvancedSearchSchema } from './schemas/api/search.schema';
export { createTagSchemas, getTagsSchemas } from './schemas/api/tags.schema';
export type { TCreateTagSchemas, TTagSchemas } from './schemas/api/tags.schema';
export { getUserSchemas, getUsersSchemas } from './schemas/api/users.schema';
export type {
  TGetUserSchemas,
  TGetUsersSchemas,
} from './schemas/api/users.schema';
export {
  blockSchema,
  genderSchema,
  globalLocationSchema,
  imageSchema,
  likeSchema,
  locationSchema,
  messageSchema,
  notificationSchema,
  orientationSchema,
  reportSchema,
  tagSchema,
  userLocationSchema,
  userSchema,
  userTagSchema,
  viewSchema,
} from './schemas/database.schema';
export type {
  TBlock,
  TGender,
  TGlobalLocation,
  TImage,
  TLike,
  TLocation,
  TMessage,
  TNotification,
  TOrientation,
  TReport,
  TTag,
  TUser,
  TUserLocation,
  TUserTag,
  TUserWithNames,
  TView,
} from './schemas/database.schema';
export { sendMessageSchema } from './schemas/socket/send-message.schema';
export type { TSendMessageSchema } from './schemas/socket/send-message.schema';

//-----------------------Errors-----------------------
export { SchemaError } from './errors/schema.error';
