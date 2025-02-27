import { TGlobalLocation } from '@matcha/common';
import pg from 'pg';
import GenericRepository from './GenericRepository.js';

class GlobalLocationRepository extends GenericRepository<
  TGlobalLocation,
  null
> {
  constructor(pool: pg.Pool) {
    super('globalLocation', pool);
  }
}

export default GlobalLocationRepository;
