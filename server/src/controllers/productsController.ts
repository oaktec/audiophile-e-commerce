import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

import { productService } from "../services";

export default {
  getProducts: async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.category) {
      const products = await productService.getByCategory(
        req.query.category as string
      );
      return res.json(products);
    }

    const products = await productService.getAll();
    res.json(products);
  },
  getProductById: async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    if (isNaN(id) || id < 0) {
      return next(createHttpError(400, "Invalid id"));
    }

    const product = await productService.getById(id);

    if (!product) {
      return next(createHttpError(404, "Product not found"));
    }

    res.json(product);
  },
};
