import { capitalize, typedEntries } from '../../../utils/globals.utils.ts';
import { tableAlias, type Include } from '../type.ts';
import { generateSelectSql } from './select.ts';

type TReturnType = {
  join: string;
  joinColumns: string[];
  shouldGetIdList: Record<string, boolean>;
};

export const generateIncludeSql = <T>(
  mainAlias: string,
  include?: Include<T>
): TReturnType => {
  const query: string[] = [];
  const joinColumns: string[] = [];
  const shouldGetIdList: Record<string, boolean> = {};

  if (include) {
    for (const [includeTableName, includeTableValue] of typedEntries(include)) {
      if (includeTableValue) {
        const { selectColumns, shouldGetId } = generateSelectSql(
          includeTableName,
          tableAlias[includeTableName],
          typeof includeTableValue === 'object'
            ? includeTableValue.select
            : undefined
        );
        shouldGetIdList[includeTableName] = shouldGetId;
        joinColumns.push(
          ...selectColumns.map(
            (column) =>
              `${column} as ${includeTableName}_${column
                .split('.')[1]
                .replace(/"/g, '')}`
          )
        );
        query.push(
          `LEFT JOIN public."${capitalize(includeTableName)}" as ${
            tableAlias[includeTableName]
          } ON ${mainAlias}.id = ${tableAlias[includeTableName]}."userId"`
        );
      }
    }
  }

  return { join: query.join(' '), joinColumns, shouldGetIdList };
};
