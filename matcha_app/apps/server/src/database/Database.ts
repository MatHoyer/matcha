import pg from 'pg';
import BlockRepository from './repositories/BlockRepository.js';
import GlobalLocationRepository from './repositories/GlobalLocationRepository.js';
import ImageRepository from './repositories/ImageRepository.js';
import LikeRepository from './repositories/LikeRepository.js';
import LocationRepository from './repositories/LocationRepository.js';
import MessageRepository from './repositories/MessageRepository.js';
import NotificationRepository from './repositories/NotificationRepository';
import ReportRepository from './repositories/ReportRepository.js';
import TagRepository from './repositories/TagRepository.js';
import UserRepository from './repositories/UserRepository.js';
import UserTagRepository from './repositories/UserTagRepository.js';
import ViewRepository from './repositories/ViewRepository';

class Database {
  pool: pg.Pool;
  user: UserRepository;
  tag: TagRepository;
  userTag: UserTagRepository;
  globalLocation: GlobalLocationRepository;
  location: LocationRepository;
  like: LikeRepository;
  view: ViewRepository;
  message: MessageRepository;
  image: ImageRepository;
  notification: NotificationRepository;
  block: BlockRepository;
  report: ReportRepository;

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
    this.userTag = new UserTagRepository(this.pool);
    this.globalLocation = new GlobalLocationRepository(this.pool);
    this.location = new LocationRepository(this.pool);
    this.like = new LikeRepository(this.pool);
    this.message = new MessageRepository(this.pool);
    this.image = new ImageRepository(this.pool);
    this.notification = new NotificationRepository(this.pool);
    this.view = new ViewRepository(this.pool);
    this.block = new BlockRepository(this.pool);
    this.report = new ReportRepository(this.pool);
  }
}

const db = new Database();

export default db;
