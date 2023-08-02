import { Router } from "express";

import { cartController } from "../controllers";
import { authMiddleware } from "../middlewares";

const cartRouter = Router();

cartRouter.post("/", authMiddleware.isAuth, cartController.createCart);
// TODO :
// GET /cart/:id
// POST /cart/:id
// DELETE /cart/:id
// DELETE /cart/:id/:productId
// PUT /cart/:id/:productId

export default cartRouter;
