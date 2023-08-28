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
  checkoutCart: async (req: Request, res: Response, next: NextFunction) => {
    const cartId = req.cart?.id;

    if (!cartId) {
      return next(
        createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to checkout")
      );
    }

    const userId = req.user?.id;

    if (!userId) {
      return next(
        createHttpError(
          StatusCodes.UNAUTHORIZED,
          "You must be logged in to do that"
        )
      );
    }

    await cartService.checkout(userId, cartId);

    res.status(StatusCodes.NO_CONTENT).send();
  },
  getActiveCart: async (req: Request, res: Response, next: NextFunction) => {
    const cart = req.cart;

    if (!cart) {
      return next(
        createHttpError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Failed to get active cart"
        )
      );
    }

    const cartItemIds = await cartService.getProducts(cart.id);
    const cartProducts = await productService.getByIds(
      cartItemIds.map((item) => item.product_id)
    );
    const cartProductRet = cartProducts.map((product) => ({
      name: product.name,
      id: product.id,
      price: Number(product.price),
      slug: product.slug,
      quantity: cartItemIds.find((item) => item.product_id === product.id)
        ?.quantity,
    }));

    return res.json({
      id: cart.id,
      userId: cart.userId,
      active: cart.active,
      items: cartProductRet,
    });
  },
  addToCart: [
    validationMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      const cartId = req.cart?.id;
      const productId = Number(req.params.productId);
      const quantity = Number(req.body?.quantity);

      if (!cartId) {
        return next(
          createHttpError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Failed to add product to cart"
          )
        );
      }

      if (!productId) {
        return next(
          createHttpError(StatusCodes.BAD_REQUEST, "Product ID is required")
        );
      }

      const product = await productService.getById(productId);

      if (!product) {
        return next(
          createHttpError(StatusCodes.BAD_REQUEST, "Product not found")
        );
      }

      const cartProduct = await cartService.addProductToCart(
        cartId,
        productId,
        quantity
      );

      if (!cartProduct) {
        return next(
          createHttpError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Failed to add product to cart"
          )
        );
      }

      res.json(cartProduct);
    },
  ],
  updateCartProduct: [
    validationMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      const cartId = req.cart?.id;
      const productId = Number(req.params.productId);
      const quantity = Number(req.body?.quantity);

      if (!cartId) {
        return next(
          createHttpError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Failed to update cart product"
          )
        );
      }

      if (!productId) {
        return next(
          createHttpError(StatusCodes.BAD_REQUEST, "Product ID is required")
        );
      }

      const product = await productService.getById(productId);

      if (!product) {
        return next(
          createHttpError(StatusCodes.BAD_REQUEST, "Product not found")
        );
      }

      await cartService.updateCartProductQuantity(cartId, productId, quantity);

      const cart = req.cart;

      if (!cart) {
        return next(
          createHttpError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Failed to get active cart"
          )
        );
      }

      const cartItemIds = await cartService.getProducts(cart.id);
      const cartProducts = await productService.getByIds(
        cartItemIds.map((item) => item.product_id)
      );
      const cartProductRet = cartProducts.map((product) => ({
        name: product.name,
        id: product.id,
        price: Number(product.price),
        slug: product.slug,
        quantity: cartItemIds.find((item) => item.product_id === product.id)
          ?.quantity,
      }));

      return res.json({
        id: cart.id,
        userId: cart.userId,
        active: cart.active,
        items: cartProductRet,
      });
    },
  ],
  removeFromCart: async (req: Request, res: Response, next: NextFunction) => {
    const cartId = req.cart?.id;
    const productId = Number(req.params.productId);

    if (!cartId) {
      return next(
        createHttpError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Failed to remove product from cart"
        )
      );
    }

    if (!productId) {
      return next(
        createHttpError(StatusCodes.BAD_REQUEST, "Product ID is required")
      );
    }

    const product = await productService.getById(productId);

    if (!product) {
      return next(
        createHttpError(StatusCodes.BAD_REQUEST, "Product not found")
      );
    }

    await cartService.removeProductFromCart(cartId, productId);

    res.status(StatusCodes.NO_CONTENT).send();
  },
  deleteActiveCart: async (req: Request, res: Response, next: NextFunction) => {
    const cartId = req.cart?.id;

    if (!cartId) {
      return next(
        createHttpError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Failed to delete cart"
        )
      );
    }

    await cartService.delete(cartId);

    res.status(StatusCodes.NO_CONTENT).send();
  },
};
