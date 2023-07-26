import { Request } from "express";

export declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        token: string;
      };
    }
  }
}

export interface IUserRequest<T> extends Request {
  user?: T;
}
