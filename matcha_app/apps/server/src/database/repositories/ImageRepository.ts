import { TImage } from '@matcha/common';
import pg from 'pg';
import GenericRepository from './GenericRepository.js';

class ImageRepository extends GenericRepository<TImage, null> {
  constructor(pool: pg.Pool) {
    super('image', pool);
  }
}

export default ImageRepository;
