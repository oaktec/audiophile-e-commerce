import { Router } from "express";

import { authController } from "../controllers";
import { authValidationRules } from "../validators";
import { authMiddleware } from "../middlewares";

const authRouter = Router();

authRouter.post("/login", authMiddleware.isGuest, authController.loginUser);
authRouter.post(
  "/register",
  authMiddleware.isGuest,
  authValidationRules.registerValidationRules,
  authController.registerUser
);
authRouter.post("/logout", authMiddleware.isAuth, authController.logoutUser);
authRouter.get("/check-session", authController.checkSession);

export default authRouter;
