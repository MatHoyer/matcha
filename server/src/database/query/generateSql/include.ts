import { capitalize } from '../../../utils/capitalized.js';
import { tableAlias, type Include, type Select } from '../type.js';
import { generateSelectSql } from './select.js';

type TReturnType = {
  join: string;
  joinColumns: string[];
};

// const assertSelect = <T>(include: Include<T>): include is { select: Select<T> } => {
//   return 'select' in include;
// };

export const generateIncludeSql = <T>(mainAlias: string, include?: Include<T>): TReturnType => {
  if (!include) return { join: '', joinColumns: [] };
  console.log(include);
  const query: string[] = [];
  const joinColumns: string[] = [];
  for (const [key, value] of Object.entries(include)) {
    if (typeof value === 'boolean') console.log(key, value);
    const { select } = value as {
      select?: Select<T>;
    };
    const { selectColumns } = generateSelectSql(tableAlias[key], select);
    joinColumns.push(...selectColumns.map((column) => `${column} as ${key}_${column.split('.')[1]}`));
    query.push(
      `LEFT JOIN public."${capitalize(key)}" as ${tableAlias[key]} ON ${mainAlias}.id = ${tableAlias[key]}."userId"`
    );
  }

  return { join: query.join(' '), joinColumns };
};
