import { Router } from "express";

import authRouter from "./auth";

const router = Router();

router.use("/auth", authRouter);

router.get("/health", (req, res) => {
  res.sendStatus(200);
});

export default router;
