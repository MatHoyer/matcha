import { quoteUppercase } from '../../../utils/quoteUppercase.js';
import { tableAlias, tableKeys, type Select } from '../type.js';

type TReturnType = {
  selectColumns: string[];
};

export const generateSelectSql = <T>(alias: string, select?: Select<T>): TReturnType => {
  if (!select) {
    const tableName = Object.keys(tableAlias).find((key) => tableAlias[key] === alias);
    const object = tableKeys[tableName as keyof typeof tableKeys];
    return { selectColumns: Object.keys(object).map((key) => `${alias}.${quoteUppercase(key)}`) };
  }
  const selectColumns: string[] = [];
  for (const [key, value] of Object.entries(select)) {
    if (!value) continue;
    selectColumns.push(`${alias}.${quoteUppercase(key)}`);
  }
  return { selectColumns: selectColumns };
};
