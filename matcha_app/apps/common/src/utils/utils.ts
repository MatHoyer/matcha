import { PROMISE_BATCH_SIZE } from './datas';

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const quoteUppercase = (str: string) => {
  const hasUppercase = /[A-Z]/.test(str);
  return hasUppercase ? `"${str}"` : str;
};

export const removeDuplicate = <T>(list: T[]): T[] => {
  const tmp = new Set(list);
  return [...tmp];
};

export const typedEntries = <T extends object>(
  obj: T
): [[string, T[keyof T]]] => {
  return Object.entries(obj) as [[string, T[keyof T]]];
};

export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const containsUpperCase = (str: string): boolean => {
  return /[A-Z]/.test(str);
};

export const batchPromises = async <T>(
  promises: Promise<T>[],
  batchSize: number = PROMISE_BATCH_SIZE
) => {
  const result: T[] = [];
  for (let i = 0; i < promises.length; i += batchSize) {
    const batch = promises.slice(i, i + batchSize);
    const batchResult = await Promise.all(batch);
    result.push(...batchResult);
  }

  return result;
};
