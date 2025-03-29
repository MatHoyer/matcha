import { TBlock } from '@matcha/common';
import pg from 'pg';
import GenericRepository from './GenericRepository.js';

class BlockRepository extends GenericRepository<TBlock, null> {
  constructor(pool: pg.Pool) {
    super('block', pool);
  }
}

export default BlockRepository;
