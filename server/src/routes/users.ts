import { Router } from "express";

import { authMiddleware } from "../middlewares";
import { usersController } from "../controllers";
import { userValidationRules } from "../validators";

const usersRouter = Router();

usersRouter.get(
  "/:userId",
  authMiddleware.isUserFromParams,
  usersController.getUserById
);
usersRouter.put(
  "/:userId",
  userValidationRules.updateUserValidationRules,
  authMiddleware.isUserFromParams,
  usersController.updateUserById
);
usersRouter.delete(
  "/:userId",
  authMiddleware.isUserFromParams,
  usersController.deleteUserById
);

export default usersRouter;
