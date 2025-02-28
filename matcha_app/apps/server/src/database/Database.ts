import pg from 'pg';
import GlobalLocationRepository from './repositories/GlobalLocationRepository.js';
import LocationRepository from './repositories/LocationRepository.js';
import TagRepository from './repositories/TagRepository.js';
import UserLocationRepository from './repositories/UserLocationRepository.js';
import UserRepository from './repositories/UserRepository.js';

class Database {
  pool: pg.Pool;
  user: UserRepository;
  tag: TagRepository;
  globalLocation: GlobalLocationRepository;
  location: LocationRepository;
  userLocation: UserLocationRepository;

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
    this.globalLocation = new GlobalLocationRepository(this.pool);
    this.location = new LocationRepository(this.pool);
    this.userLocation = new UserLocationRepository(this.pool);
  }
}

const db = new Database();

export default db;
