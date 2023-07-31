import { Router } from "express";

import { authMiddleware } from "../middlewares";
import { usersController } from "../controllers";
import { userValidationRules } from "../validators";

const usersRouter = Router();

usersRouter.get(
  "/:id",
  authMiddleware.isAuth,
  authMiddleware.isUserFromParams,
  usersController.getUserById
);
usersRouter.put(
  "/:id",
  userValidationRules.updateUserValidationRules,
  authMiddleware.isAuth,
  authMiddleware.isUserFromParams,
  usersController.updateUserById
);
usersRouter.delete(
  "/:id",
  authMiddleware.isAuth,
  authMiddleware.isUserFromParams,
  usersController.deleteUserById
);

export default usersRouter;
