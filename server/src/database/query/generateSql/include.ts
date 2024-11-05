import { capitalize } from '../../../utils/capitalized.js';
import { typedEntries } from '../../../utils/typedEntries.js';
import { tableAlias, type Include } from '../type.js';
import { generateSelectSql } from './select.js';

type TReturnType = {
  join: string;
  joinColumns: string[];
  shouldGetIdList: Record<string, boolean>;
};

export const generateIncludeSql = <T>(mainAlias: string, include?: Include<T>): TReturnType => {
  const query: string[] = [];
  const joinColumns: string[] = [];
  const shouldGetIdList: Record<string, boolean> = {};

  if (include) {
    for (const [includeTableName, includeTableValue] of typedEntries(include)) {
      if (includeTableValue) {
        const { selectColumns, shouldGetId } = generateSelectSql(
          includeTableName,
          tableAlias[includeTableName],
          typeof includeTableValue === 'object' ? includeTableValue.select : undefined
        );
        shouldGetIdList[includeTableName] = shouldGetId;
        joinColumns.push(
          ...selectColumns.map((column) => `${column} as ${includeTableName}_${column.split('.')[1].replace(/"/g, '')}`)
        );
        query.push(
          `LEFT JOIN public."${capitalize(includeTableName)}" as ${tableAlias[includeTableName]} ON ${mainAlias}.id = ${
            tableAlias[includeTableName]
          }."userId"`
        );
      }
    }
  }

  return { join: query.join(' '), joinColumns, shouldGetIdList };
};

// if (!include) return { join: '', joinColumns: [], shouldGetId: {} };
// const query: string[] = [];
// const joinColumns: string[] = [];

// let shouldGetId: Record<string, boolean> = {};
// for (const [key, value] of Object.entries(include)) {
//   const { select } = value as {
//     select?: Select<T>;
//   };
//   if (typeof select === 'object') {
//     if ('id' in Object.keys(select)) {
//       shouldGetId[key] = select['id' as keyof Select<T>] || false;
//     } else {
//       const newSelect = { id: Object.values(select).every((v) => v === false) ? false : true, ...select };
//       shouldGetId[key] = false;
//       include[key as keyof Include<T>] = { select: newSelect };
//     }
//   } else {
//     shouldGetId[key] = true;
//   }
// }

// for (const [key, value] of Object.entries(include)) {
//   if (!value) continue;
//   const { select } = value as {
//     select?: Select<T>;
//   };
//   const { selectColumns } = generateSelectSql(key, tableAlias[key], select);
//   joinColumns.push(...selectColumns.map((column) => `${column} as ${key}_${column.split('.')[1].replace(/"/g, '')}`));
//   query.push(
//     `LEFT JOIN public."${capitalize(key)}" as ${tableAlias[key]} ON ${mainAlias}.id = ${tableAlias[key]}."userId"`
//   );
// }

// return { join: query.join(' '), joinColumns, shouldGetId };
