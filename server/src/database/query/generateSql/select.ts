import type { Select } from '../type.js';

type TReturnType = {
  selectColumns: string[];
};

export const generateSelectSql = <T>(alias: string, select?: Select<T>): TReturnType => {
  if (!select) return { selectColumns: [`${alias}.*`] };
  const selectColumns: string[] = [];
  for (const [key, value] of Object.entries(select)) {
    if (!value) continue;
    selectColumns.push(`${alias}.${key}`);
  }
  return { selectColumns: selectColumns };
};
