import { TUser } from '@matcha/common';

declare global {
  namespace Express {
    interface Request {
      user: TUser;
    }
  }
}
