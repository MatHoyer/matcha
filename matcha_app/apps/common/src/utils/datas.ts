export const AUTH_COOKIE_NAME = 'auth-token';
export const GENDERS = ['Male', 'Female'] as const;
export const ORIENTATIONS = ['Heterosexual', 'Bisexual', 'Homosexual'] as const;
export const NOTIF_TYPES = [
  'Like',
  'View',
  'Message',
  'Match',
  'Unlike',
] as const;
export const NOTIF_TYPES_MESSAGES: Record<
  (typeof NOTIF_TYPES)[number],
  string
> = {
  Like: 'liked your profile',
  View: 'viewed your profile',
  Message: 'You have a new message from',
  Match: 'You have a match with',
  Unlike: 'unliked your profile',
};

export const EMPTY_FIND_SEARCH = '--';
export const DECIMAL_SEPARATOR: string = ',';
export const THOUSAND_SEPARATOR: string = ' ';

export const PROMISE_BATCH_SIZE = 10;
