import { Router } from "express";

import { cartController } from "../controllers";
import { authMiddleware, cartMiddleware } from "../middlewares";
import { cartValidationRules } from "../validators";

const cartRouter = Router();

cartRouter.get(
  "/",
  authMiddleware.isAuth,
  cartMiddleware.hasActiveCart,
  cartController.getActiveCart
);
cartRouter.delete(
  "/",
  authMiddleware.isAuth,
  cartMiddleware.hasActiveCart,
  cartController.deleteActiveCart
);
cartRouter.post(
  "/add/:productId",
  authMiddleware.isAuth,
  cartMiddleware.hasActiveCart,
  cartValidationRules.quantityValidationRules,
  cartController.addToCart
);
cartRouter.delete(
  "/remove/:productId",
  authMiddleware.isAuth,
  cartMiddleware.hasActiveCart,
  cartController.removeFromCart
);
cartRouter.patch(
  "/update/:productId",
  authMiddleware.isAuth,
  cartMiddleware.hasActiveCart,
  cartValidationRules.quantityValidationRules,
  cartController.updateCartProduct
);
cartRouter.post(
  "/checkout",
  authMiddleware.isAuth,
  cartMiddleware.hasActiveCart,
  cartController.checkoutCart
);

export default cartRouter;
