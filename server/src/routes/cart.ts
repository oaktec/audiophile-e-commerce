import { Router } from "express";

import { cartController } from "../controllers";
import { authMiddleware, cartMiddleware } from "../middlewares";
import { cartValidationRules } from "../validators";

const cartRouter = Router();

cartRouter.post(
  "/:userId",
  authMiddleware.isAuth,
  authMiddleware.isUserFromParams,
  cartController.createCartForUser
);
cartRouter.get(
  "/:userId",
  authMiddleware.isAuth,
  authMiddleware.isUserFromParams,
  cartMiddleware.hasActiveCart,
  cartController.getActiveCart
);
cartRouter.delete(
  "/:userId",
  authMiddleware.isAuth,
  authMiddleware.isUserFromParams,
  cartMiddleware.hasActiveCart,
  cartController.deleteActiveCart
);
cartRouter.post(
  "/:userId/add/:productId",
  authMiddleware.isAuth,
  authMiddleware.isUserFromParams,
  cartMiddleware.hasActiveCart,
  cartValidationRules.quantityValidationRules,
  cartController.addToCart
);
cartRouter.delete(
  "/:userId/remove/:productId",
  authMiddleware.isAuth,
  authMiddleware.isUserFromParams,
  cartMiddleware.hasActiveCart,
  cartController.removeFromCart
);
cartRouter.put(
  "/:userId/update/:productId",
  authMiddleware.isAuth,
  authMiddleware.isUserFromParams,
  cartMiddleware.hasActiveCart,
  cartValidationRules.quantityValidationRules,
  cartController.updateCartProduct
);

export default cartRouter;
