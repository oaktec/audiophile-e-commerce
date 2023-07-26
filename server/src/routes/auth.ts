import { Router } from "express";

import { authController } from "../controllers";
import { authValidationRules } from "../validators";
import { authMiddleware } from "../middlewares";

const authRouter = Router();

authRouter.post(
  "/login",
  authMiddleware.isGuest,
  authValidationRules.loginValidationRules,
  authController.loginUser
);
authRouter.post(
  "/register",
  authMiddleware.isGuest,
  authValidationRules.registerValidationRules,
  authController.registerUser
);

export default authRouter;
