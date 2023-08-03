export declare global {
  namespace Express {
    interface User {
      id: number;
    }

    interface Request {
      cart?: {
        id: number;
        userId: number;
        active: boolean;
      };
    }
  }
}
