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
          sql.push(
            `${parentKey} IN (${(value as unknown[])
              .map((_, i) => `$${indexCounter + i}`)
              .join(', ')})`
          );
          indexCounter += (value as unknown[]).length - 1;
          break;
        default:
          sql.push(`${key} = $${indexCounter}`);
          break;
      }
      if (Array.isArray(value)) {
        values.push(...value);
      } else {
        values.push(value);
      }
      indexCounter++;
    } else {
      if (value !== null) {
        const { whereClause: query, values: resultValues } =
          generateWhereClauseSql(value, key, indexCounter);
        sql.push(query);
        values.push(...resultValues);
        indexCounter += values.length;
      }
    }
  }
  if (parentKey) return { whereClause: `(${sql.join(' AND ')})`, values };
  console.log(`WHERE ${sql.join(' AND ')}`, values);
  return { whereClause: `WHERE ${sql.join(' AND ')}`, values };
};
