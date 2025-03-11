import { getDateAsString } from '@matcha/common';
import fs from 'fs';
import path from 'path';

const template = fs.readFileSync(
  path.join(__dirname, 'default-email.html'),
  'utf-8'
);

export const ResetPasswordMail = ({
  link,
  linkText,
}: {
  link: string;
  linkText: string;
}) => {
  return template
    .replace('{{title}}', 'Reset password')
    .replace(
      '{{content}}',
      'To reset your password, please click on the button below'
    )
    .replace('{{link}}', link)
    .replace('{{linkText}}', linkText)
    .replace(
      '{{year}}',
      getDateAsString({
        date: new Date(),
        type: 'YEAR',
      })
    );
};
