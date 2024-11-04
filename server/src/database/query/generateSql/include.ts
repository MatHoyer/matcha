import { capitalize } from '../../../utils/capitalized.js';
import { tableAlias, type Include, type Select } from '../type.js';
import { generateSelectSql } from './select.js';

type TReturnType = {
  join: string;
  joinColumns: string[];
  shouldGetId: Record<string, boolean>;
};

// const assertSelect = <T>(include: Include<T>): include is { select: Select<T> } => {
//   return 'select' in include;
// };

export const generateIncludeSql = <T>(mainAlias: string, include?: Include<T>): TReturnType => {
  if (!include) return { join: '', joinColumns: [], shouldGetId: {} };
  const query: string[] = [];
  const joinColumns: string[] = [];

  let shouldGetId: Record<string, boolean> = {};
  for (const [key, value] of Object.entries(include)) {
    const { select } = value as {
      select?: Select<T>;
    };
    if (typeof select === 'object') {
      if ('id' in Object.keys(select)) {
        shouldGetId[key] = select['id' as keyof Select<T>] || false;
      } else {
        const newSelect = { id: Object.values(select).every((v) => v === false) ? false : true, ...select };
        shouldGetId[key] = false;
        include[key as keyof Include<T>] = { select: newSelect };
      }
    } else {
      shouldGetId[key] = true;
    }
  }

  for (const [key, value] of Object.entries(include)) {
    if (!value) continue;
    const { select } = value as {
      select?: Select<T>;
    };
    const { selectColumns } = generateSelectSql(tableAlias[key], select);
    joinColumns.push(...selectColumns.map((column) => `${column} as ${key}_${column.split('.')[1].replace(/"/g, '')}`));
    query.push(
      `LEFT JOIN public."${capitalize(key)}" as ${tableAlias[key]} ON ${mainAlias}.id = ${tableAlias[key]}."userId"`
    );
  }

  return { join: query.join(' '), joinColumns, shouldGetId };
};
