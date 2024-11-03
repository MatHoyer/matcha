import type { WhereClause } from '../type.js';

type TReturnType = {
  query: string;
  values: any[];
};

export const generateWhereClauseSql = <T>(where?: WhereClause<T>, parentKey?: string, index?: number): TReturnType => {
  if (!where) return { query: '', values: [] };
  const sql: string[] = [];
  const values: any[] = [];
  let indexCounter = index || 1;
  for (const [key, value] of Object.entries(where)) {
    if (typeof value !== 'object') {
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
        default:
          sql.push(`${key} = $${indexCounter}`);
          break;
      }
      values.push(value);
      indexCounter++;
    } else {
      if (value !== null) {
        const { query, values: resultValues } = generateWhereClauseSql(value, key, indexCounter);
        sql.push(query);
        values.push(...resultValues);
        indexCounter += values.length;
      }
    }
  }
  if (parentKey) return { query: `(${sql.join(' AND ')})`, values };
  return { query: `WHERE ${sql.join(' AND ')}`, values };
};
