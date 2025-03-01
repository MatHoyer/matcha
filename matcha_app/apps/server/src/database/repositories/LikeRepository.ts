import { TLike } from '@matcha/common';
import pg from 'pg';
import GenericRepository from './GenericRepository.js';

class LikeRepository extends GenericRepository<TLike, null> {
  constructor(pool: pg.Pool) {
    super('like', pool);
  }
}

export default LikeRepository;
