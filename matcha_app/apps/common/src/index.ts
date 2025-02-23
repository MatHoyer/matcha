// -----------------------Validator-----------------------
export { z, ZodType } from './validator';
export type { Infer } from './validator';

//-----------------------Get URL-----------------------
export { getServerUrl } from './getServer';
export { getUrl } from './getUrl';

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
export { errorSchema } from './schemas/error.schema';
export type { TErrorSchema } from './schemas/error.schema';
