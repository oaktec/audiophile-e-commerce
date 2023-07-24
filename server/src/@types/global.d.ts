import { Request } from "express";

export declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>;
    }
  }
}

export interface IUserRequest<T> extends Request {
  user?: T;
}
