import pg from 'pg';
import UserRepository from './repositories/UserRepository.js';

class Database {
  pool: pg.Pool;
  user: UserRepository;

  constructor() {
    this.pool = new pg.Pool({
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_NAME,
      port: parseInt(process.env.POSTGRES_PORT as string),
    });

    this.pool.connect();
    this.user = new UserRepository(this.pool);
  }
}

const db = new Database();

export default db;
