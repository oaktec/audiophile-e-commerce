"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const ordersRouter = (0, express_1.Router)();
ordersRouter.get("/", middlewares_1.authMiddleware.isAuth, controllers_1.ordersController.getAllOrders);
ordersRouter.get("/:id", middlewares_1.authMiddleware.isAuth, controllers_1.ordersController.getOrderById);
exports.default = ordersRouter;
