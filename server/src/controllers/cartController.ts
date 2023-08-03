import { Request, Response, NextFunction } from "express";

import createHttpError from "http-errors";

import { StatusCodes } from "http-status-codes";

import { cartService, productService } from "../services";
import { validationMiddleware } from "../middlewares";

export default {
  createCartForUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = Number(req.params.userId);

    if (!userId) {
      return next(
        createHttpError(
          StatusCodes.UNAUTHORIZED,
          "You must be logged in to do that"
        )
      );
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
      return next(
        createHttpError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Failed to create cart"
        )
      );
    }

    res.status(StatusCodes.CREATED).json({
      id: cart.id,
    });
  },
  getActiveCart: (req: Request, res: Response, next: NextFunction) => {
    const cart = req.cart;

    res.json(cart);
  },
  addToCart: [
    validationMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      const cartId = req.cart?.id;
      const productId = Number(req.params.productId);
      const quantity = Number(req.body?.quantity);

      if (!cartId) {
        return next(createHttpError(500, "Failed to add product to cart"));
      }

      if (!productId) {
        return next(createHttpError(400, "Product ID is required"));
      }

      const product = await productService.getById(productId);

      if (!product) {
        return next(createHttpError(400, "Product not found"));
      }

      const cartProduct = await cartService.addProductToCart(
        cartId,
        productId,
        quantity
      );

      if (!cartProduct) {
        return next(createHttpError(500, "Failed to add product to cart"));
      }

      res.json(cartProduct);
    },
  ],
  removeFromCart: async (req: Request, res: Response, next: NextFunction) => {
    const cartId = req.cart?.id;
    const productId = Number(req.params.productId);

    if (!cartId) {
      return next(createHttpError(500, "Failed to remove product from cart"));
    }

    if (!productId) {
      return next(createHttpError(400, "Product ID is required"));
    }

    const product = await productService.getById(productId);

    if (!product) {
      return next(createHttpError(400, "Product not found"));
    }

    await cartService.removeProductFromCart(cartId, productId);

    res.status(StatusCodes.NO_CONTENT).send();
  },
  deleteActiveCart: async (req: Request, res: Response, next: NextFunction) => {
    const cartId = req.cart?.id;

    if (!cartId) {
      return next(createHttpError(500, "Failed to delete cart"));
    }

    await cartService.delete(cartId);

    res.status(StatusCodes.NO_CONTENT).send();
  },
};
