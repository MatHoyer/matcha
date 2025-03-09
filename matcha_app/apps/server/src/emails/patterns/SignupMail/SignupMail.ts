import { getDateAsString } from '@matcha/common';
import fs from 'fs';
import path from 'path';

const template = fs.readFileSync(path.join(__dirname, 'mail.html'), 'utf-8');

export const SignupMail = ({
  link,
  linkText,
}: {
  link: string;
  linkText: string;
}) => {
  return template
    .replace('{{link}}', link)
    .replace('{{linkText}}', linkText)
    .replace(
      '{{year}}',
      getDateAsString({
        date: new Date(),
        type: 'YEAR',
      }),
    );
};
