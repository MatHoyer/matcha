import pg from 'pg';

import { capitalize, quoteUppercase } from '@matcha/common';
import { generateObject } from '../query/generateObject.js';
import { generateIncludeSql } from '../query/generateSql/include.js';
import { generateOrderBySql } from '../query/generateSql/orderBy.js';
import { generateSelectSql } from '../query/generateSql/select.js';
import { generateWhereClauseSql } from '../query/generateSql/whereClause.js';
import {
  tableAlias,
  type CommonOptions,
  type WhereClause,
} from '../query/type.js';

class GenericRepository<T, I> {
  alias: string;
  name: string;
  tableName: string;
  tableView?: string;
  pool: pg.Pool;

  constructor(tableName: string, pool: pg.Pool) {
    this.alias = tableAlias[tableName];
    this.name = tableName;
    this.tableName = `public."${capitalize(tableName)}"`;
    this.tableView = ['user'].includes(tableName)
      ? `public."${capitalize(tableName)}_v"`
      : undefined;
    this.pool = pool;
  }

  // eslint-disable-next-line
  async #query(queryString: string, values: Array<any>) {
    try {
      const { rows } = await this.pool.query(queryString, values);
      return rows;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async #find(options: CommonOptions<T, I>) {
    const { where, include, select, take, skip } = options;

    const { whereClause, values } = generateWhereClauseSql(where);
    const { selectColumns, shouldGetId } = generateSelectSql(
      this.name,
      this.alias,
      select
    );
    const { join, joinColumns, shouldGetIdList } = generateIncludeSql(
      this.alias,
      include
    );
    const orderBy = generateOrderBySql(this.alias, options.orderBy);

    shouldGetIdList['main'] = shouldGetId;
    selectColumns.push(...joinColumns);
    const columns = selectColumns.join(', ');

    const queryString = `SELECT ${columns} FROM ${
      this.tableView ?? this.tableName
    } as ${this.alias} 
      ${join} 
      ${whereClause} 
      ${orderBy}
      ${'LIMIT ' + (take ?? 'ALL')} 
      ${skip ? `OFFSET ${skip}` : ''}
      `;

    const rows = await this.#query(queryString, values);
    return rows ? generateObject(rows, shouldGetIdList) : null;
  }

  async #create(data: Omit<T, 'id'>) {
    const columns = Object.keys(data)
      .map((column) => quoteUppercase(column))
      .join(', ');
    const values = Object.values(data).map((value) => {
      if (typeof value === 'boolean') {
        return value ? 'TRUE' : 'FALSE';
      }
      return value;
    });
    const rows = await this.#query(
      `INSERT INTO ${this.tableName} (${columns}) VALUES (${values
        .map((_, index) => `$${index + 1}`)
        .join(', ')}) RETURNING *`,
      values
    );
    return rows ? rows[0] : null;
  }

  async #remove(option: { where: WhereClause<T> }) {
    const { where } = option;
    const { whereClause, values } = generateWhereClauseSql(where);
    if (!whereClause) throw new Error('No where clause provided');
    const rows = await this.#query(
      `DELETE FROM ${this.tableName} ${whereClause} RETURNING *`,
      values
    );
    return rows ? rows[0] : null;
  }

  async findFirst(
    options: Omit<CommonOptions<T, I>, 'take' | 'skip'>
  ): Promise<T | null> {
    return (await this.#find({ ...options, take: 1 })) as T | null;
  }

  async findMany(options: CommonOptions<T, I>): Promise<T[]> {
    const res = await this.#find(options);
    return res ? (Array.isArray(res) ? res : [res]) : [];
  }

  async create(content: { data: Omit<T, 'id'> }): Promise<T | null> {
    return await this.#create(content.data);
  }

  async remove(options: { where: WhereClause<T> }) {
    return await this.#remove(options);
  }

  async update(options: { where: WhereClause<T>; data: Partial<T> }) {
    const { where, data } = options;
    const { whereClause, values } = generateWhereClauseSql(where);
    if (!whereClause) throw new Error('No where clause provided');
    const columns = Object.keys(data)
      .filter((column) => !['id', 'age'].includes(column))
      .map(
        (column, index) =>
          `${quoteUppercase(column)} = $${index + values.length + 1}`
      )
      .join(', ');
    const dataValues = Object.values(data).map((value) => {
      if (typeof value === 'boolean') {
        return value ? 'TRUE' : 'FALSE';
      }
      return value;
    });
    const rows = await this.#query(
      `UPDATE ${this.tableName} SET ${columns} ${whereClause} RETURNING *`,
      [...values, ...dataValues]
    );
    return rows ? rows[0] : null;
  }
}

export default GenericRepository;
