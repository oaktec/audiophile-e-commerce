import { Router } from "express";

import authRouter from "./auth";
import productsRouter from "./products";

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productsRouter);

router.get("/health", (req, res) => {
  res.sendStatus(200);
});

export default router;
