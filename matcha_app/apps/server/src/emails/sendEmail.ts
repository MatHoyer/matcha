import { env } from '../env';
import { resend } from './resend';

type ResendSendType = typeof resend.emails.send;
type ResendParamsType = Parameters<ResendSendType>;
type ResendParamsTypeWithConditionalFrom = [
  payload: Omit<ResendParamsType[0], 'from'> & { from?: string },
  options?: ResendParamsType[1],
];

/**
 * sendEmail will send an email using resend.
 * To avoid repeating the same "from" email, you can leave it empty and it will use the default one.
 * Also, in development, it will add "[DEV]" to the subject.
 * @param params[0] : payload
 * @param params[1] : options
 * @returns a promise of the email sent
 */
export const sendEmail = async (
  ...params: ResendParamsTypeWithConditionalFrom
) => {
  if (env.NODE_ENV === 'DEV') {
    params[0].subject = `[DEV] ${params[0].subject}`;
  }
  const resendParams = [
    {
      ...params[0],
      from: params[0].from ?? env.RESEND_API_EMAIL_FROM,
      to: env.NODE_ENV === 'DEV' ? env.RESEND_API_EMAIL_TO : params[0].to,
    } as ResendParamsType[0],
    params[1],
  ] satisfies ResendParamsType;

  const result = await resend.emails.send(...resendParams);

  return result;
};
