"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const services_1 = require("../services");
exports.default = {
    getAllOrders: async (req, res, next) => {
        const userId = req.user?.id;
        if (!userId) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You must be logged in to do that"));
        }
        const orders = await services_1.orderService.getAllOrdersByUserId(userId);
        res.status(http_status_codes_1.StatusCodes.OK).json(orders);
    },
    getOrderById: async (req, res, next) => {
        const userId = req.user?.id;
        const orderId = Number(req.params.id);
        if (isNaN(orderId)) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid order ID"));
        }
        if (!userId) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You must be logged in to do that"));
        }
        const order = await services_1.orderService.getOrderById(orderId);
        if (!order) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, "Order does not exist"));
        }
        if (order.userId !== userId) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not the owner of this order"));
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(order);
    },
};
