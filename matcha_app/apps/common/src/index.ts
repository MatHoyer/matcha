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
} from './utils';
