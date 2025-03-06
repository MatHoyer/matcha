import { quoteUppercase } from '@matcha/common';
import { OrderBy } from '../type';

export const generateOrderBySql = <T>(
  tableAlias: string,
  orderBy?: OrderBy<T>
) => {
  if (!orderBy) return '';
  const orderBys = [] as string[];
  for (const [key, value] of Object.entries(orderBy)) {
    orderBys.push(
      `${tableAlias}.${quoteUppercase(key)} ${value === 'asc' ? 'ASC' : 'DESC'}`
    );
  }

  return `ORDER BY ${orderBys.join(', ')}`;
};
