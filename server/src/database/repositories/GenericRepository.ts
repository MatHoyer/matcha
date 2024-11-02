import pg from 'pg';

class GenericRepository<T> {
  tableName: string;
  pool: pg.Pool;

  constructor(tableName: string, pool: pg.Pool) {
    this.tableName = `public."${tableName}"`;
    this.pool = pool;
  }

  async findMany(where?: {}): Promise<T[]> {
    const { rows } = await this.pool.query(`SELECT * FROM ${this.tableName}`);
    return rows;
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    const columns = Object.keys(data).join(', ');
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
