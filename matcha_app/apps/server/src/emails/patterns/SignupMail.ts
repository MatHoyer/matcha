import { getDateAsString } from '@matcha/common';
import { template } from './import-template';

export const SignupMail = ({
  link,
  linkText,
}: {
  link: string;
  linkText: string;
}) => {
  return template
    .replace('{{title}}', 'Welcome to Matcha')
    .replace(
      '{{content}}',
      'To continue your inscription, please click on the button below'
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
