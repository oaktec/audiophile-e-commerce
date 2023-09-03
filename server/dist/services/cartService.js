"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const db_1 = __importDefault(require("../db"));
const mapCart = (cart) => ({
    id: cart.id,
    userId: cart.user_id,
    active: cart.active,
});
exports.default = {
    create: async (userId) => {
        const { rows } = await db_1.default.query("INSERT INTO carts (user_id) VALUES ($1) RETURNING *", [userId]);
        if (rows.length === 0) {
            return null;
        }
        const cart = rows[0];
        return mapCart(cart);
    },
    getProducts: async (cartId) => {
        const { rows } = await db_1.default.query("SELECT * FROM cart_items WHERE cart_id = $1", [cartId]);
        return rows;
    },
    checkout: async (userId, cartId, address, postcode, city, paymentMethod, paymentParams, phone) => {
        const products = await db_1.default.query("SELECT * FROM cart_items WHERE cart_id = $1", [cartId]);
        if (products.rows.length === 0) {
            throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, "Cart is empty");
        }
        try {
        }
        catch (err) {
            throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to checkout cart");
        }
        const client = await db_1.default.getClient();
        try {
            await client.query("BEGIN");
            if (!phone)
                await client.query("INSERT INTO orders (user_id, cart_id, address, postcode, city, payment_method) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [userId, cartId, address, postcode, city, paymentMethod]);
            else
                await client.query("INSERT INTO orders (user_id, cart_id, address, postcode, city, payment_method, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [userId, cartId, address, postcode, city, paymentMethod, phone]);
            await client.query("UPDATE carts SET active = false WHERE id = $1", [
                cartId,
            ]);
            await client.query("COMMIT");
        }
        catch (err) {
            await client.query("ROLLBACK");
            console.error(err);
            throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to checkout cart");
        }
        finally {
            client.release();
        }
    },
    getActiveCartByUserId: async (userId) => {
        const { rows } = await db_1.default.query("SELECT * FROM carts WHERE user_id = $1 AND active = true", [userId]);
        if (rows.length === 0) {
            return null;
        }
        const cart = rows[0];
        return mapCart(cart);
    },
    addProductToCart: async (cartId, productId, quantity) => {
        const { rows: existingProductRows } = await db_1.default.query("SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2", [cartId, productId]);
        const { rows } = await db_1.default.query(existingProductRows.length > 0
            ? "UPDATE cart_items SET quantity = $3 WHERE cart_id = $1 AND product_id = $2 RETURNING *"
            : "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *", [
            cartId,
            productId,
            existingProductRows.length > 0
                ? quantity + existingProductRows[0].quantity
                : quantity,
        ]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    },
    updateCartProductQuantity: async (cartId, productId, quantity) => {
        const { rows } = await db_1.default.query("UPDATE cart_items SET quantity = $3 WHERE cart_id = $1 AND product_id = $2 RETURNING *", [cartId, productId, quantity]);
        if (rows.length === 0) {
            throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, "Product not found in cart");
        }
        return rows[0];
    },
    removeProductFromCart: async (cartId, productId) => {
        const { rows } = await db_1.default.query("DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING *", [cartId, productId]);
        if (rows.length === 0) {
            throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, "Product not found in cart");
        }
    },
    delete: async (cartId) => {
        await db_1.default.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);
        await db_1.default.query("DELETE FROM carts WHERE id = $1", [cartId]);
    },
};
