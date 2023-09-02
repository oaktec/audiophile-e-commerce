import { Router } from "express";

import authRouter from "./auth";
import cartRouter from "./cart";
import productsRouter from "./products";
import ordersRouter from "./orders";
import usersRouter from "./users";
import { paymentIntent } from "../config/stripe";

const router = Router();

router.use("/auth", authRouter);
router.use("/cart", cartRouter);
router.use("/products", productsRouter);
router.use("/orders", ordersRouter);
router.use("/users", usersRouter);

router.get("/api/health", (req, res) => {
  res.sendStatus(200);
});

router.get("/stripe-secret", async (req, res) => {
  const amount = req.query.amount;
  if (!amount || isNaN(Number(amount))) {
    res.status(400).json({ error: "Invalid amount" });
    return;
  }

  const intent = await paymentIntent(Number(amount));

  res.json({ clientSecret: intent.client_secret });
});

export default router;
