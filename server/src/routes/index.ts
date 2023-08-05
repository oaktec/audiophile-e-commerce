import { Router } from "express";

import authRouter from "./auth";
import cartRouter from "./cart";
import productsRouter from "./products";
import ordersRouter from "./orders";
import usersRouter from "./users";

const router = Router();

router.use("/auth", authRouter);
router.use("/cart", cartRouter);
router.use("/products", productsRouter);
router.use("/orders", ordersRouter);
router.use("/users", usersRouter);

router.get("/health", (req, res) => {
  res.sendStatus(200);
});

export default router;
