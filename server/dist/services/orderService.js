"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const db_1 = __importDefault(require("../db"));
const productService_1 = __importDefault(require("./productService"));
const mapOrder = (order) => ({
    id: order.id,
    userId: order.user_id,
    cartId: order.cart_id,
    status: order.status,
    items: [],
    total: 0,
    orderDate: order.order_date,
});
const populateOrder = async (order) => {
    const populatedOrder = mapOrder(order);
    const items = await db_1.default.query("SELECT * FROM cart_items WHERE cart_id = $1", [
        populatedOrder.cartId,
    ]);
    populatedOrder.items = await Promise.all(items.rows.map(async (item) => {
        const product = await productService_1.default.getById(item.product_id);
        if (!product) {
            throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to find product while populating order");
        }
        return {
            product,
            quantity: item.quantity,
        };
    }));
    populatedOrder.total = populatedOrder.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    return populatedOrder;
};
exports.default = {
    getAllOrdersByUserId: async (userId) => {
        const orders = await db_1.default.query("SELECT * FROM orders WHERE user_id = $1", [
            userId,
        ]);
        return Promise.all(orders.rows.map(populateOrder));
    },
    getOrderById: async (id) => {
        const { rows } = await db_1.default.query("SELECT * FROM orders WHERE id = $1", [id]);
        if (rows.length === 0) {
            return null;
        }
        return populateOrder(rows[0]);
    },
};
