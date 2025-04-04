import fs from 'fs';
import path from 'path';
import { env } from '../../env';

export const template = fs.readFileSync(
  env.NODE_ENV === 'DEV'
    ? path.join(__dirname, 'default-email.html')
    : path.join(
        __dirname,
        '../../../../../src/emails/patterns/default-email.html'
      ),
  'utf-8'
);
