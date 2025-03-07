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
export { messagesSchemas } from './schemas/api/messages.schema';
export type { TMessagesSchemas } from './schemas/api/messages.schema';
export { notificationsSchemas } from './schemas/api/notifications.schema';
export type { TNotificationsSchemas } from './schemas/api/notifications.schema';
export {
  createPictureSchemas,
  deletePictureSchemas,
  getPictureSchemas,
  getPicturesSchemas,
  getProfilePictureSchemas,
  updatePictureSchemas,
} from './schemas/api/picture.schema';
export type {
  TCreatePictureSchemas,
  TDeletePictureSchemas,
  TGetPictureSchemas,
  TGetPicturesSchemas,
  TGetProfilePictureSchemas,
  TUpdatePictureSchemas,
} from './schemas/api/picture.schema';
export { advancedSearchSchema } from './schemas/api/search.schema';
export type { TAdvancedSearchSchema } from './schemas/api/search.schema';
export {
  createTagSchemas,
  getTagsSchemas,
  getUserTagsSchemas,
} from './schemas/api/tags.schema';
export type {
  TCreateTagSchemas,
  TGetUserTagsSchemas,
  TTagSchemas,
} from './schemas/api/tags.schema';
export {
  getUserSchemas,
  getUsersSchemas,
  updateUserSchemas,
} from './schemas/api/users.schema';
export type {
  TGetUserSchemas,
  TGetUsersSchemas,
  TUpdateUserSchemas,
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
export { events } from './schemas/socket/events.schema';
export { sendMessageSchema } from './schemas/socket/send-message.schema';
export type { TSendMessageSchema } from './schemas/socket/send-message.schema';

//-----------------------Errors-----------------------
export { SchemaError } from './errors/schema.error';
