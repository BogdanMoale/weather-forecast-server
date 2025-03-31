export interface User {
  username: string;
  password: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
