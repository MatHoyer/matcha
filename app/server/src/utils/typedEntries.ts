export const typedEntries = <T extends object>(obj: T): [[string, T[keyof T]]] => {
  return Object.entries(obj) as [[string, T[keyof T]]];
};
