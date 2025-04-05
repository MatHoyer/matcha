import { Infer, TUser, userSchema, z } from '@matcha/common';
import pg from 'pg';
import type {
  CommonOptions,
  UserIncludes,
  WhereClause,
} from '../query/type.js';
import GenericRepository from './GenericRepository.js';

const _userWithOptional = z.object({
  ...userSchema.pick([
    'id',
    'name',
    'lastName',
    'email',
    'username',
    'birthDate',
    'gender',
    'preference',
    'password',
  ]).shape,
  ...userSchema
    .pick(['age', 'biography', 'lastTimeOnline', 'isOnline', 'isActivate'])
    .partial().shape,
});
type TUserWithOptional = Infer<typeof _userWithOptional>;

class UserRepository extends GenericRepository<
  TUserWithOptional,
  UserIncludes
> {
  constructor(pool: pg.Pool) {
    super('user', pool);
  }

  async findFirst(
    options: Omit<
      CommonOptions<TUserWithOptional, UserIncludes>,
      'take' | 'skip'
    >
  ): Promise<TUser | null> {
    return (await super.findFirst(options)) as TUser | null;
  }

  async findMany(options: CommonOptions<TUserWithOptional, UserIncludes>) {
    return (await super.findMany(options)) as TUser[];
  }

  async create(content: {
    data: Omit<TUserWithOptional, 'id'>;
  }): Promise<TUser | null> {
    return (await super.create(content)) as TUser | null;
  }

  async update(options: {
    where: WhereClause<TUserWithOptional>;
    data: Partial<TUserWithOptional>;
  }) {
    return (await super.update(options)) as TUser | null;
  }

  async remove(options: { where: WhereClause<TUserWithOptional> }) {
    return (await super.remove(options)) as TUser | null;
  }
}

export default UserRepository;
