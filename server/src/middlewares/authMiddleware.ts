import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

export default {
  isAuth: (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return next(
        createHttpError(
          StatusCodes.UNAUTHORIZED,
          "You must be logged in to do that"
        )
      );
    }

    next();
  },
  isAuthUserFromParams: (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return next(
        createHttpError(
          StatusCodes.UNAUTHORIZED,
          "You must be logged in to do that"
        )
      );
    }

    const id = Number(req.params.userId);

    if (isNaN(id) || id < 0) {
      return next(createHttpError(StatusCodes.BAD_REQUEST, "Invalid user id"));
    }

    if (req.user.id !== id) {
      return next(
        createHttpError(
          StatusCodes.FORBIDDEN,
          "You do not have permission to do that"
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
