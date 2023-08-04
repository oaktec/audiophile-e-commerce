import { Router } from "express";

import { cartController } from "../controllers";
import { authMiddleware, cartMiddleware } from "../middlewares";
import { cartValidationRules } from "../validators";

const cartRouter = Router();

cartRouter.post(
  "/:userId",
  authMiddleware.isAuthUserFromParams,
  cartController.createCartForUser
);
cartRouter.get(
  "/:userId",
  authMiddleware.isAuthUserFromParams,
  cartMiddleware.hasActiveCart,
  cartController.getActiveCart
);
cartRouter.delete(
  "/:userId",
  authMiddleware.isAuthUserFromParams,
  cartMiddleware.hasActiveCart,
  cartController.deleteActiveCart
);
cartRouter.post(
  "/:userId/add/:productId",
  authMiddleware.isAuthUserFromParams,
  cartMiddleware.hasActiveCart,
  cartValidationRules.quantityValidationRules,
  cartController.addToCart
);
cartRouter.delete(
  "/:userId/remove/:productId",
  authMiddleware.isAuthUserFromParams,
  cartMiddleware.hasActiveCart,
  cartController.removeFromCart
);
cartRouter.put(
  "/:userId/update/:productId",
  authMiddleware.isAuthUserFromParams,
  cartMiddleware.hasActiveCart,
  cartValidationRules.quantityValidationRules,
  cartController.updateCartProduct
);
cartRouter.post(
  "/:userId/checkout",
  authMiddleware.isAuthUserFromParams,
  cartMiddleware.hasActiveCart,
  cartController.checkoutCart
);

export default cartRouter;
