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

export const typedEntries = <T extends object>(obj: T): [[string, T[keyof T]]] => {
  return Object.entries(obj) as [[string, T[keyof T]]];
};
