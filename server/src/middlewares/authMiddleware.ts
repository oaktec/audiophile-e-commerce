import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

export default {
  isAuth: (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return next(
        createHttpError(
          StatusCodes.UNAUTHORIZED,
          "You must be logged in to access this resource"
        )
      );
    }

    next();
  },
  isGuest: (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next(
        createHttpError(StatusCodes.BAD_REQUEST, "You are already logged in")
      );
    }

    next();
  },
};
