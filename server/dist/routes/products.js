"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const productsRouter = (0, express_1.Router)();
productsRouter.get("/", controllers_1.productsController.getProducts);
productsRouter.get("/:slug", controllers_1.productsController.getProductBySlug);
exports.default = productsRouter;
