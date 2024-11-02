import pg from 'pg';
import type { User } from '../query/type.js';
import GenericRepository from './GenericRepository.js';

class UserRepository extends GenericRepository<User> {
  constructor(pool: pg.Pool) {
    super('User', pool);
  }
}

export default UserRepository;
