"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const services_1 = require("../services");
exports.default = {
    getProducts: async (req, res, next) => {
        if (req.query.category) {
            const products = await services_1.productService.getByCategory(req.query.category);
            return res.json(products);
        }
        const products = await services_1.productService.getAll();
        res.json(products);
    },
    getProductBySlug: async (req, res, next) => {
        const slug = req.params.slug;
        if (!slug) {
            return next((0, http_errors_1.default)(400, "Missing slug"));
        }
        const product = await services_1.productService.getBySlug(slug);
        if (!product) {
            return next((0, http_errors_1.default)(404, "Product not found"));
        }
        res.json(product);
    },
};
