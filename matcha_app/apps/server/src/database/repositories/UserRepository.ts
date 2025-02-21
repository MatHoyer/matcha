import pg from 'pg';
import type { User, UserIncludes } from '../query/type.js';
import GenericRepository from './GenericRepository.js';

class UserRepository extends GenericRepository<User, UserIncludes> {
  constructor(pool: pg.Pool) {
    super('user', pool);
  }
}

export default UserRepository;
