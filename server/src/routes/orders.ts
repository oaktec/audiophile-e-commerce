import { Router } from "express";

import { ordersController } from "../controllers";
import { authMiddleware } from "../middlewares";

const ordersRouter = Router();

ordersRouter.get("/", authMiddleware.isAuth, ordersController.getAllOrders);
ordersRouter.get("/:id", authMiddleware.isAuth, ordersController.getOrderById);

export default ordersRouter;
