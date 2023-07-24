import { Request, Response, NextFunction } from "express";

import jwt from "../utils/jwt";
import { userService } from "../services";

export default {
  authMiddleware: (req: Request, res: Response, next: NextFunction) => {
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
};
