import { Router } from "express";

import { cartController } from "../controllers";
import { authMiddleware, cartMiddleware } from "../middlewares";
import { cartValidationRules } from "../validators";

const cartRouter = Router();

cartRouter.post(
  "/:userId",
  authMiddleware.isUserFromParams,
  cartController.createCartForUser
);
cartRouter.get(
  "/:userId",
  authMiddleware.isUserFromParams,
  cartMiddleware.hasActiveCart,
  cartController.getActiveCart
);
cartRouter.delete(
  "/:userId",
  authMiddleware.isUserFromParams,
  cartMiddleware.hasActiveCart,
  cartController.deleteActiveCart
);
cartRouter.post(
  "/:userId/add/:productId",
  authMiddleware.isUserFromParams,
  cartMiddleware.hasActiveCart,
  cartValidationRules.quantityValidationRules,
  cartController.addToCart
);
cartRouter.delete(
  "/:userId/remove/:productId",
  authMiddleware.isUserFromParams,
  cartMiddleware.hasActiveCart,
  cartController.removeFromCart
);
cartRouter.patch(
  "/:userId/update/:productId",
  authMiddleware.isUserFromParams,
  cartMiddleware.hasActiveCart,
  cartValidationRules.quantityValidationRules,
  cartController.updateCartProduct
);
cartRouter.post(
  "/:userId/checkout",
  authMiddleware.isUserFromParams,
  cartMiddleware.hasActiveCart,
  cartController.checkoutCart
);

export default cartRouter;
