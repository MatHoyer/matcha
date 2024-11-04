import pg from 'pg';

import { capitalize } from '../../utils/capitalized.js';
import { quoteUppercase } from '../../utils/quoteUppercase.js';
import { generateObject } from '../query/generateObject.js';
import { generateIncludeSql } from '../query/generateSql/include.js';
import { generateSelectSql } from '../query/generateSql/select.js';
import { generateWhereClauseSql } from '../query/generateSql/whereClause.js';
import { tableAlias, type Include, type Select, type WhereClause } from '../query/type.js';

class GenericRepository<T, I> {
  alias: string;
  tableName: string;
  pool: pg.Pool;

  constructor(tableName: string, pool: pg.Pool) {
    this.alias = tableAlias[tableName];
    this.tableName = `public."${capitalize(tableName)}"`;
    this.pool = pool;
  }

  async findMany(data: { where?: WhereClause<T>; include?: Include<I>; select?: Select<T> }) {
    const { where, include, select } = data;

    const { query, values } = generateWhereClauseSql(where);

    const { join, joinColumns } = generateIncludeSql(this.alias, include);
    const { selectColumns } = generateSelectSql(this.alias, select);
    selectColumns.push(...joinColumns);
    const columns = selectColumns.join(', ');

    const queryString = `SELECT ${columns} FROM ${this.tableName} as ${this.alias} ${join} ${query}`;

    console.log(queryString, values);
    const { rows } = await this.pool.query(queryString, values);
    console.log(rows);
    return generateObject(rows);
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    const columns = Object.keys(data)
      .map((column) => quoteUppercase(column))
      .join(', ');
    const values = Object.values(data);
    const { rows } = await this.pool.query(
      `INSERT INTO ${this.tableName} (${columns}) VALUES (${values
        .map((_, index) => `$${index + 1}`)
        .join(', ')}) RETURNING *`,
      values
    );
    return rows[0];
  }
}

export default GenericRepository;
