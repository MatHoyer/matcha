import { TMessage } from '@matcha/common';
import pg from 'pg';
import GenericRepository from './GenericRepository.js';

class MessageRepository extends GenericRepository<TMessage, null> {
  constructor(pool: pg.Pool) {
    super('message', pool);
  }
}

export default MessageRepository;
