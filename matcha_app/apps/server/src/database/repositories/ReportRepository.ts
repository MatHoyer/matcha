import { TReport } from '@matcha/common';
import pg from 'pg';
import GenericRepository from './GenericRepository.js';

class ReportRepository extends GenericRepository<TReport, null> {
  constructor(pool: pg.Pool) {
    super('report', pool);
  }
}

export default ReportRepository;
