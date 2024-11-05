import { quoteUppercase } from '../../../utils/quoteUppercase.js';
import { tableKeys, type Select } from '../type.js';

type TReturnType = {
  selectColumns: string[];
  shouldGetId: boolean;
};

const selectAllKeys = (tableName: string, tableAlias: string, selectColumns: string[]) => {
  const tableType = tableKeys[tableName as keyof typeof tableKeys];
  for (const key of Object.keys(tableType)) {
    selectColumns.push(`${tableAlias}.${quoteUppercase(key)}`);
  }
};

export const generateSelectSql = <T>(tableName: string, tableAlias: string, select?: Select<T>): TReturnType => {
  const selectColumns: string[] = [];
  let shouldGetId = false;

  switch (typeof select) {
    case 'undefined':
      selectAllKeys(tableName, tableAlias, selectColumns);
      shouldGetId = true;
      break;

    case 'object':
      for (const [key, value] of Object.entries(select)) {
        if (!value) continue;
        if (key === 'id') shouldGetId = true;
        selectColumns.push(`${tableAlias}.${quoteUppercase(key)}`);
      }
      if (!shouldGetId) selectColumns.push(`${tableAlias}.id`);
      break;
  }

  return { selectColumns, shouldGetId };
};
