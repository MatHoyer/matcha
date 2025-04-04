import { getDateAsString } from '@matcha/common';
import { template } from './import-template';

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
