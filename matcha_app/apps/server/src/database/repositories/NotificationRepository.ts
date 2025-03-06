import { TNotification } from '@matcha/common';
import pg from 'pg';
import GenericRepository from './GenericRepository.js';

class NotificationRepository extends GenericRepository<TNotification, null> {
  constructor(pool: pg.Pool) {
    super('notification', pool);
  }
}

export default NotificationRepository;
