"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const validators_1 = require("../validators");
const middlewares_1 = require("../middlewares");
const authRouter = (0, express_1.Router)();
authRouter.post("/login", middlewares_1.authMiddleware.isGuest, controllers_1.authController.loginUser);
authRouter.post("/register", middlewares_1.authMiddleware.isGuest, validators_1.authValidationRules.registerValidationRules, controllers_1.authController.registerUser);
authRouter.post("/logout", middlewares_1.authMiddleware.isAuth, controllers_1.authController.logoutUser);
authRouter.get("/check-session", controllers_1.authController.checkSession);
exports.default = authRouter;
