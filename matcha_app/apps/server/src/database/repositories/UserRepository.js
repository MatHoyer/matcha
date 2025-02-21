import GenericRepository from './GenericRepository.js';
class UserRepository extends GenericRepository {
    constructor(pool) {
        super('user', pool);
    }
}
export default UserRepository;
