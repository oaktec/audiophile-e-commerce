import { Router } from "express";
import { authController } from "../controllers";
import { authValidationRules } from "../validators";

const router = Router();

router.post(
  "/login",
  authValidationRules.loginValidationRules,
  authController.loginUser
);
router.post(
  "/register",
  authValidationRules.registerValidationRules,
  authController.registerUser
);

export default router;
