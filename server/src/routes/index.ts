import { Router } from "express";

import authRouter from "./auth";
import productsRouter from "./products";
import usersRouter from "./users";

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productsRouter);
router.use("/users", usersRouter);

router.get("/health", (req, res) => {
  res.sendStatus(200);
});

export default router;
