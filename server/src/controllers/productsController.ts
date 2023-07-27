import { Request, Response, NextFunction } from "express";

import createHttpError from "http-errors";

import { productService } from "../services";

export default {
  getProducts: async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.category) {
      const products = await productService.getByCategory(
        Number(req.query.category)
      );
      return res.json(products);
    }

    const products = await productService.getAll();
    res.json(products);
  },
  getProductById: async (req: Request, res: Response, next: NextFunction) => {
    const product = await productService.getById(Number(req.params.id));

    if (!product) {
      return next(createHttpError(404, "Product not found"));
    }

    res.json(product);
  },
};
