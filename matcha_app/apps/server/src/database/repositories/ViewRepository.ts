import { TView } from '@matcha/common';
import pg from 'pg';
import GenericRepository from './GenericRepository.js';

class ViewRepository extends GenericRepository<TView, null> {
  constructor(pool: pg.Pool) {
    super('view', pool);
  }
}

export default ViewRepository;
