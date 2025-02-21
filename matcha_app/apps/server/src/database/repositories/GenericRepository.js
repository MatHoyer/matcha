import { capitalize, quoteUppercase } from '../../utils/globals.utils.js';
import { generateObject } from '../query/generateObject.js';
import { generateIncludeSql } from '../query/generateSql/include.js';
import { generateSelectSql } from '../query/generateSql/select.js';
import { generateWhereClauseSql } from '../query/generateSql/whereClause.js';
import { tableAlias, } from '../query/type.js';
class GenericRepository {
    alias;
    name;
    tableName;
    pool;
    constructor(tableName, pool) {
        this.alias = tableAlias[tableName];
        this.name = tableName;
        this.tableName = `public."${capitalize(tableName)}"`;
        this.pool = pool;
    }
    async #query(queryString, values) {
        try {
            const { rows } = await this.pool.query(queryString, values);
            return rows;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    async #find(options) {
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
        const rows = await this.#query(queryString, values);
        return rows ? generateObject(rows, shouldGetIdList) : null;
    }
    async #create(data) {
        const columns = Object.keys(data)
            .map((column) => quoteUppercase(column))
            .join(', ');
        const values = Object.values(data);
        const rows = await this.#query(`INSERT INTO ${this.tableName} (${columns}) VALUES (${values
            .map((_, index) => `$${index + 1}`)
            .join(', ')}) RETURNING *`, values);
        return rows ? rows[0] : null;
    }
    async #remove(option) {
        const { where } = option;
        const { whereClause, values } = generateWhereClauseSql(where);
        if (!whereClause)
            throw new Error('No where clause provided');
        const rows = await this.#query(`DELETE FROM ${this.tableName} ${whereClause}`, values);
        return rows ? rows[0] : null;
    }
    async findFirst(options) {
        return (await this.#find({ ...options, take: 1 }));
    }
    async findMany(options) {
        return await this.#find(options);
    }
    async create(content) {
        return await this.#create(content.data);
    }
    async remove(options) {
        return await this.#remove(options);
    }
}
export default GenericRepository;
