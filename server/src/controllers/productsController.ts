import { Request, Response, NextFunction } from "express";

import { productService } from "../services";

export default {
  getProducts: async (req: Request, res: Response, next: NextFunction) => {
    const products = await productService.getAll();
    res.json(products);
  },
  getProductById: async (req: Request, res: Response, next: NextFunction) => {
    throw new Error("Not implemented");
  },
};
