import { containsUpperCase } from '@matcha/common';
import type { WhereClause } from '../type.js';

type TReturnType = {
  whereClause: string;
  // eslint-disable-next-line
  values: any[];
};

export const generateWhereClauseSql = <T>(
  where?: WhereClause<T>,
  parentKey?: string,
  index?: number
): TReturnType => {
  if (!where) return { whereClause: '', values: [] };
  const sql: string[] = [];
  // eslint-disable-next-line
  const values: any[] = [];
  let indexCounter = index || 1;
  for (const [key, value] of Object.entries(where)) {
    if (typeof value !== 'object' || (Array.isArray(value) && key === '$in')) {
      if (!value) {
        continue;
      }
      parentKey = containsUpperCase(parentKey!) ? `"${parentKey}"` : parentKey;
      switch (key) {
        case '$gt':
          sql.push(`${parentKey} > $${indexCounter}`);
          break;
        case '$lt':
          sql.push(`${parentKey} < $${indexCounter}`);
          break;
        case '$gte':
          sql.push(`${parentKey} >= $${indexCounter}`);
          break;
        case '$lte':
          sql.push(`${parentKey} <= $${indexCounter}`);
          break;
        case '$not':
          sql.push(`${parentKey} <> $${indexCounter}`);
          break;
        case '$in':
          if (!Array.isArray(value)) {
            break;
          }
          if (value.length === 0) {
            sql.push('FALSE');
            break;
          }
          sql.push(
            `${parentKey} IN (${(value as unknown[])
              .map((_, i) => {
                return `$${indexCounter + i}`;
              })
              .join(', ')})`
          );
          break;
        default:
          sql.push(
            `${containsUpperCase(key) ? `"${key}"` : key} = $${indexCounter}`
          );
          break;
      }
      if (value && Array.isArray(value) && value.length > 0) {
        values.push(...value);
        indexCounter += value.length;
      }
      if (value && !Array.isArray(value)) {
        values.push(value);
        indexCounter++;
      }
    } else if (value) {
      const { whereClause: query, values: resultValues } =
        generateWhereClauseSql(value, key, indexCounter);
      if (query && resultValues.every((v) => v)) {
        sql.push(query);
        values.push(...resultValues);
        indexCounter += resultValues.length;
      }
    }
  }
  if (parentKey)
    return {
      whereClause:
        sql.length > 0
          ? `(${sql.join(
              ` ${
                parentKey === 'AND' || parentKey === 'OR' ? parentKey : 'AND'
              } `
            )})`
          : '',
      values,
    };
  console.log(`WHERE ${sql.join(' AND ')}`, values);
  return {
    whereClause: `WHERE ${sql.join(' AND ')}`,
    values,
  };
};
