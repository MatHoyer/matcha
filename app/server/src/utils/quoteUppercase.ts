export const quoteUppercase = (str: string) => {
  const hasUppercase = /[A-Z]/.test(str);
  return hasUppercase ? `"${str}"` : str;
};
