import { Router } from "express";

import { authMiddleware } from "../middlewares";
import { usersController } from "../controllers";
import { userValidationRules } from "../validators";

const usersRouter = Router();

usersRouter.get(
  "/:userId",
  authMiddleware.isAuthUserFromParams,
  usersController.getUserById
);
usersRouter.put(
  "/:userId",
  userValidationRules.updateUserValidationRules,
  authMiddleware.isAuthUserFromParams,
  usersController.updateUserById
);
usersRouter.delete(
  "/:userId",
  authMiddleware.isAuthUserFromParams,
  usersController.deleteUserById
);

export default usersRouter;
