// -----------------------Validator-----------------------
export { z, ZodType } from './validator';
export type { Infer } from './validator';

//-----------------------Get URL-----------------------
export { getServerUrl } from './getServer';
export { getUrl } from './getUrl';

//-----------------------Datas-----------------------
export { AUTH_COOKIE_NAME, GENDERS, ORIENTATIONS } from './datas';

//-----------------------Utils-----------------------
export {
  capitalize,
  quoteUppercase,
  removeDuplicate,
  typedEntries,
} from './utils';
