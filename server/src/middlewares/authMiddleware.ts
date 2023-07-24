import { Request, Response, NextFunction } from "express";

import jwt from "../utils/jwt";
import { userService } from "../services";

export default {
  authorize: (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return next();
      }

      const userId = jwt.verifyToken(token).id;

      const user = userService.getById(userId);

      if (!user) {
        return next();
      }

      req.user = user;

      next();
    } catch (err) {
      res.status(401).json({ message: "Unauthorized" });
    }
  },
  isAuth: (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    next();
  },
  isGuest: (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      return res.status(400).json({ message: "Already logged in" });
    }

    next();
  },
};
