import { TUser } from '@matcha/common';
import pg from 'pg';
import type { UserIncludes } from '../query/type.js';
import GenericRepository from './GenericRepository.js';

class UserRepository extends GenericRepository<TUser, UserIncludes> {
  constructor(pool: pg.Pool) {
    super('user', pool);
  }
}

export default UserRepository;
