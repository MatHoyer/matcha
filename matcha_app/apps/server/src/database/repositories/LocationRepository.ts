import { TLocation } from '@matcha/common';
import pg from 'pg';
import GenericRepository from './GenericRepository.js';

class LocationRepository extends GenericRepository<TLocation, null> {
  constructor(pool: pg.Pool) {
    super('location', pool);
  }
}

export default LocationRepository;
