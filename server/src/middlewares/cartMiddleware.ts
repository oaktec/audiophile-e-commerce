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

    let cart = await cartService.getActiveCartByUserId(userId);

    if (!cart) {
      cart = await cartService.create(userId);
    }

    if (!cart) {
      return next(
        createHttpError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Failed to create cart"
        )
      );
    }

    req.cart = cart;

    next();
  },
};
