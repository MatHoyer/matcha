import { TUserLocation } from '@matcha/common';
import pg from 'pg';
import GenericRepository from './GenericRepository.js';

class UserLocationRepository extends GenericRepository<TUserLocation, null> {
  constructor(pool: pg.Pool) {
    super('userLocation', pool);
  }
}

export default UserLocationRepository;
