"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const validators_1 = require("../validators");
const cartRouter = (0, express_1.Router)();
cartRouter.get("/", middlewares_1.authMiddleware.isAuth, middlewares_1.cartMiddleware.hasActiveCart, controllers_1.cartController.getActiveCart);
cartRouter.delete("/", middlewares_1.authMiddleware.isAuth, middlewares_1.cartMiddleware.hasActiveCart, controllers_1.cartController.deleteActiveCart);
cartRouter.post("/add/:productId", middlewares_1.authMiddleware.isAuth, middlewares_1.cartMiddleware.hasActiveCart, validators_1.cartValidationRules.quantityValidationRules, controllers_1.cartController.addToCart);
cartRouter.delete("/remove/:productId", middlewares_1.authMiddleware.isAuth, middlewares_1.cartMiddleware.hasActiveCart, controllers_1.cartController.removeFromCart);
cartRouter.patch("/update/:productId", middlewares_1.authMiddleware.isAuth, middlewares_1.cartMiddleware.hasActiveCart, validators_1.cartValidationRules.quantityValidationRules, controllers_1.cartController.updateCartProduct);
cartRouter.post("/checkout", middlewares_1.authMiddleware.isAuth, middlewares_1.cartMiddleware.hasActiveCart, validators_1.cartValidationRules.checkoutValidationRules, controllers_1.cartController.checkoutCart);
exports.default = cartRouter;
