import { getDateAsString } from '@matcha/common';
import { template } from './import-template';

export const LoginMail = ({
  link,
  linkText,
}: {
  link: string;
  linkText: string;
}) => {
  return template
    .replace('{{title}}', 'Login to Matcha')
    .replace(
      '{{content}}',
      'To confirm your login, please click on the button below'
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
