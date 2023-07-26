import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export default {
  isAuth: (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    next();
  },
  isGuest: (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Already logged in" });
    }

    next();
  },
};
