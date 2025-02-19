import crypto from 'crypto';

export const hashPassword = (password: string, salt: string) => {
  const hash = crypto.createHash('sha256');

  const saltedPassword = `${salt}${password}`;

  hash.update(saltedPassword);

  const hashedPassword = hash.digest('hex');

  return hashedPassword;
};
