import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import jwt from "../utils/jwt";
import { userService } from "../services";
import { IUserRequest } from "../@types/global.d";

export default {
  authorize: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;
      if (!authorization || !authorization.startsWith("Bearer ")) {
        return next();
      }

      const token = authorization.split(" ")[1];

      if (!token) {
        return next();
      }

      const payload = jwt.verifyToken(token);

      if (!payload || !payload.id) {
        return next();
      }

      const rows = await userService.getById(payload.id);
      const user = rows[0];

      Object.assign(req, { user });

      next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  isAuth: (
    req: IUserRequest<{ id: string; token: string }>,
    res: Response,
    next: NextFunction
  ) => {
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
