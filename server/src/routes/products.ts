import { Router } from "express";

import { productsController } from "../controllers";

const productsRouter = Router();

productsRouter.get("/", productsController.getProducts);
productsRouter.get("/:slug", productsController.getProductBySlug);

export default productsRouter;
