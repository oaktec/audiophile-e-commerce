import { Request, Response, NextFunction } from "express";

import createHttpError from "http-errors";

import { StatusCodes } from "http-status-codes";

import { cartService } from "../services";

export default {
  createCart: async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
      return next(createHttpError(401, "You must be logged in to do that"));
    }

    let cart = await cartService.getActiveCartByUserId(userId);

    if (cart) {
      return next(
        createHttpError(
          StatusCodes.BAD_REQUEST,
          "You already have an active cart"
        )
      );
    }

    cart = await cartService.create(userId);

    if (!cart) {
      return next(createHttpError(500, "Failed to create cart"));
    }

    res.status(StatusCodes.CREATED).json({
      id: cart.id,
    });
  },
};
