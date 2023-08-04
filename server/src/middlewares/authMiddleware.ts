import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return next(
      createHttpError(
        StatusCodes.UNAUTHORIZED,
        "You must be logged in to do that"
      )
    );
  }

  next();
};

export default {
  isAuth,
  isUserFromParams: [
    isAuth,
    (req: Request, res: Response, next: NextFunction) => {
      const id = Number(req.params.userId);

      if (isNaN(id) || id < 0) {
        return next(
          createHttpError(StatusCodes.BAD_REQUEST, "Invalid user id")
        );
      }

      const userId = req.user?.id;

      if (userId !== id) {
        return next(
          createHttpError(
            StatusCodes.FORBIDDEN,
            "You do not have permission to do that"
          )
        );
      }

      next();
    },
  ],
  isGuest: (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next(
        createHttpError(StatusCodes.BAD_REQUEST, "You are already logged in")
      );
    }

    next();
  },
};
