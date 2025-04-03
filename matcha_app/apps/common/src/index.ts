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
  NOTIF_TYPES,
  NOTIF_TYPES_MESSAGES,
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
  confirmSchemas,
  loginSchemas,
  logoutSchemas,
  resendConfirmSchemas,
  sessionSchemas,
  signupSchemas,
} from './schemas/api/auth.schema';
export type {
  TConfirmSchemas,
  TLoginSchemas,
  TLogoutSchemas,
  TResendConfirmSchemas,
  TSessionSchemas,
  TSignupSchemas,
} from './schemas/api/auth.schema';
export {
  blockUserSchemas,
  unblockUserSchemas,
} from './schemas/api/block.schema';
export type {
  TBlockUserSchemas,
  TUnblockUserSchemas,
} from './schemas/api/block.schema';
export { errorSchema } from './schemas/api/error.schema';
export type { TErrorSchema } from './schemas/api/error.schema';
export { getGlobalLocationsSchemas } from './schemas/api/globalLocations.schema';
export type { TGlobalLocationsSchemas } from './schemas/api/globalLocations.schema';
export {
  createLikeSchemas,
  deleteLikeSchemas,
  isLikedSchemas,
  likesMeSchemas,
} from './schemas/api/like.schema';
export type {
  TCreateLikeSchemas,
  TDeleteLikeSchemas,
  TIsLikedSchemas,
  TLikesMeSchemas,
} from './schemas/api/like.schema';
export {
  getUserLocationSchemas,
  isNeedUpdateLocationSchemas,
  updateLocationSchemas,
} from './schemas/api/location.schema';
export type {
  TGetUserLocationSchemas,
  TIsNeedUpdateLocationSchemas,
  TUpdateLocationSchemas,
} from './schemas/api/location.schema';
export { messagesSchemas } from './schemas/api/messages.schema';
export type { TMessagesSchemas } from './schemas/api/messages.schema';
export {
  notificationsOtherUserSchema,
  notificationsSchemas,
  updateNotificationSchemas,
} from './schemas/api/notifications.schema';
export type {
  TNotificationsOtherUserSchema,
  TNotificationsSchemas,
} from './schemas/api/notifications.schema';
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
export { reportUserSchemas } from './schemas/api/report.schema';
export type { TReportUserSchemas } from './schemas/api/report.schema';
export {
  advancedSearchSchema,
  forYouSchema,
  suggestUsersSchema,
} from './schemas/api/search.schema';
export type {
  TAdvancedSearchSchema,
  TForYouSchema,
  TSuggestUsersSchema,
} from './schemas/api/search.schema';
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
  askResetPasswordSchemas,
  getUserFameSchemas,
  getUserSchemas,
  getUsersSchemas,
  isBlockedSchemas,
  resetPasswordSchemas,
  updateUserSchemas,
  usersMatchSchemas,
} from './schemas/api/users.schema';
export type {
  TAskResetPasswordSchemas,
  TGetUserFameSchemas,
  TGetUserSchemas,
  TGetUsersSchemas,
  TIsBlockedSchemas,
  TResetPasswordSchemas,
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
  TUserTag,
  TUserWithNames,
  TView,
} from './schemas/database.schema';
export { events, sendMessageSchema } from './schemas/socket/events.schema';
export type { TSendMessageSchema } from './schemas/socket/events.schema';

//-----------------------Errors-----------------------
export { SchemaError } from './errors/schema.error';
