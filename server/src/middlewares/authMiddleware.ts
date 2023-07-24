import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import jwt from "../utils/jwt";
import { userService } from "../services";

export default {
  authorize: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return next();
      }

      const payload = jwt.verifyToken(token);

      if (!payload || !payload.id) {
        return next();
      }

      const user = await userService.getById(payload.id);

      if (!user) {
        return next();
      }

      req.user = user;
      next();
    } catch (err) {
      console.error(err);
      next();
    }
  },
  isAuth: (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    next();
  },
  isGuest: (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Already logged in" });
    }

    next();
  },
};
