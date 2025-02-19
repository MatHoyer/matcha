import pg from 'pg';
import type { User, UserIncludes } from '../query/type.ts';
import GenericRepository from './GenericRepository.ts';

class UserRepository extends GenericRepository<User, UserIncludes> {
  constructor(pool: pg.Pool) {
    super('user', pool);
  }
}

export default UserRepository;
