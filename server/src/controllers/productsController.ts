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
  getProductBySlug: async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;

    if (!slug) {
      return next(createHttpError(400, "Missing slug"));
    }

    const product = await productService.getBySlug(slug);

    if (!product) {
      return next(createHttpError(404, "Product not found"));
    }

    res.json(product);
  },
};
