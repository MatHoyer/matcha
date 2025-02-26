import pg from 'pg';
import TagRepository from './repositories/TagRepository.js';
import UserRepository from './repositories/UserRepository.js';

class Database {
  pool: pg.Pool;
  user: UserRepository;
  tag: TagRepository;

  constructor() {
    this.pool = new pg.Pool({
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      port: parseInt(process.env.POSTGRES_PORT as string),
    });

    this.pool.connect();
    this.user = new UserRepository(this.pool);
    this.tag = new TagRepository(this.pool);
  }
}

const db = new Database();

export default db;
