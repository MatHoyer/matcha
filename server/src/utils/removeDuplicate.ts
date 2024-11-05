export const removeDuplicate = <T>(list: T[]): T[] => {
  const tmp = new Set(list);
  return [...tmp];
};
