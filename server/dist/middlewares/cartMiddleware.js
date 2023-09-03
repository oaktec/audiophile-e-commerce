"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const services_1 = require("../services");
exports.default = {
    hasActiveCart: async (req, res, next) => {
        const userId = req.user?.id;
        if (!userId) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You must be logged in to do that"));
        }
        let cart = await services_1.cartService.getActiveCartByUserId(userId);
        if (!cart) {
            cart = await services_1.cartService.create(userId);
        }
        if (!cart) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create cart"));
        }
        req.cart = cart;
        next();
    },
};
