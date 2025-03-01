import { TUserTag } from '@matcha/common';
import pg from 'pg';
import GenericRepository from './GenericRepository.js';

class UserTagRepository extends GenericRepository<TUserTag, null> {
  constructor(pool: pg.Pool) {
    super('userTag', pool);
  }
}

export default UserTagRepository;
