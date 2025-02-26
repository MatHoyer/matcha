import { TTag } from '@matcha/common';
import pg from 'pg';
import GenericRepository from './GenericRepository.js';

class TagRepository extends GenericRepository<TTag, null> {
  constructor(pool: pg.Pool) {
    super('tag', pool);
  }
}

export default TagRepository;
