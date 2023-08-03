import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

import { cartService } from "../services";

export default {
  hasActiveCart: async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
      return next(
        createHttpError(
          StatusCodes.UNAUTHORIZED,
          "You must be logged in to do that"
        )
      );
    }

    const cart = await cartService.getActiveCartByUserId(userId);

    if (!cart) {
      return next(
        createHttpError(StatusCodes.NOT_FOUND, "You do not have an active cart")
      );
    }

    req.cart = cart;

    next();
  },
};
