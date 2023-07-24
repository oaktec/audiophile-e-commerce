import { Router } from "express";
import { authController } from "../controllers";
import { authValidationRules } from "../validators";
import { authMiddleware } from "../middlewares";

const router = Router();

router.post(
  "/login",
  authMiddleware.isGuest,
  authValidationRules.loginValidationRules,
  authController.loginUser
);
router.post(
  "/register",
  authMiddleware.isGuest,
  authValidationRules.registerValidationRules,
  authController.registerUser
);

export default router;
