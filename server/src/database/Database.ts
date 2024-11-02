import pg from 'pg';
import UserRepository from './repositories/UserRepository.js';

class Database {
  pool: pg.Pool;
  user: UserRepository;

  constructor() {
    this.pool = new pg.Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT as string),
    });

    this.pool.connect();
    this.user = new UserRepository(this.pool);
  }
}

const db = new Database();

export default db;
