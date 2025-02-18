import pg from 'pg';

import { capitalize } from '../../utils/capitalized.js';
import { quoteUppercase } from '../../utils/quoteUppercase.js';
import { generateObject } from '../query/generateObject.js';
import { generateIncludeSql } from '../query/generateSql/include.js';
import { generateSelectSql } from '../query/generateSql/select.js';
import { generateWhereClauseSql } from '../query/generateSql/whereClause.js';
import { tableAlias, type CommonOptions, type WhereClause } from '../query/type.js';

class GenericRepository<T, I> {
  alias: string;
  name: string;
  tableName: string;
  pool: pg.Pool;

  constructor(tableName: string, pool: pg.Pool) {
    this.alias = tableAlias[tableName];
    this.name = tableName;
    this.tableName = `public."${capitalize(tableName)}"`;
    this.pool = pool;
  }

  async #find(options: CommonOptions<T, I>) {
    const { where, include, select, take, skip } = options;

    const { whereClause, values } = generateWhereClauseSql(where);
    const { selectColumns, shouldGetId } = generateSelectSql(this.name, this.alias, select);
    const { join, joinColumns, shouldGetIdList } = generateIncludeSql(this.alias, include);

    shouldGetIdList['main'] = shouldGetId;
    selectColumns.push(...joinColumns);
    const columns = selectColumns.join(', ');

    const queryString = `SELECT ${columns} FROM ${this.tableName} as ${this.alias} 
      ${join} 
      ${whereClause} 
      ${'LIMIT ' + (take ?? 'ALL')} 
      ${skip ? `OFFSET ${skip}` : ''}
      `;

    const { rows } = await this.pool.query(queryString, values);
    return generateObject(rows, shouldGetIdList);
  }

  async #create(data: Omit<T, 'id'>) {
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

  async #remove(option: { where: WhereClause<T> }) {
    const { where } = option;
    const { whereClause, values } = generateWhereClauseSql(where);
    if (!whereClause) throw new Error('No where clause provided');
    const { rows } = await this.pool.query(`DELETE FROM ${this.tableName} ${whereClause}`, values);
    return rows[0];
  }

  async findFirst(options: Omit<CommonOptions<T, I>, 'take' | 'skip'>) {
    return await this.#find({ ...options, take: 1 });
  }

  async findMany(options: CommonOptions<T, I>) {
    return await this.#find(options);
  }

  async create(data: Omit<T, 'id'>) {
    return await this.#create(data);
  }

  async remove(options: { where: WhereClause<T> }) {
    return await this.#remove(options);
  }
}

export default GenericRepository;
