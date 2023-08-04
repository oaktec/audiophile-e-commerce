import createHttpError from "http-errors";

import { StatusCodes } from "http-status-codes";

import db from "../db";

interface DBCart {
  id: number;
  user_id: number;
  active: boolean;
}

interface Cart {
  id: number;
  userId: number;
  active: boolean;
}

const mapCart = (cart: DBCart): Cart => ({
  id: cart.id,
  userId: cart.user_id,
  active: cart.active,
});

export default {
  create: async (userId: number): Promise<Cart | null> => {
    const { rows } = await db.query(
      "INSERT INTO carts (user_id) VALUES ($1) RETURNING *",
      [userId]
    );

    if (rows.length === 0) {
      return null;
    }

    const cart = rows[0];

    return mapCart(cart);
  },
  checkout: async (userId: number, cartId: number) => {
    const products = await db.query(
      "SELECT * FROM cart_items WHERE cart_id = $1",
      [cartId]
    );

    if (products.rows.length === 0) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Cart is empty");
    }

    try {
      // payment logic
    } catch (err) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Failed to checkout cart");
    }

    await db.query("INSERT INTO orders (user_id, cart_id) VALUES ($1, $2)", [
      userId,
      cartId,
    ]);
    await db.query("UPDATE carts SET active = false WHERE id = $1", [cartId]);
  },
  getActiveCartByUserId: async (userId: number): Promise<Cart | null> => {
    const { rows } = await db.query(
      "SELECT * FROM carts WHERE user_id = $1 AND active = true",
      [userId]
    );

    if (rows.length === 0) {
      return null;
    }

    const cart = rows[0];

    return mapCart(cart);
  },
  addProductToCart: async (
    cartId: number,
    productId: number,
    quantity: number
  ) => {
    const { rows } = await db.query(
      "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [cartId, productId, quantity]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  },
  updateCartProductQuantity: async (
    cartId: number,
    productId: number,
    quantity: number
  ) => {
    const { rows } = await db.query(
      "UPDATE cart_items SET quantity = $3 WHERE cart_id = $1 AND product_id = $2 RETURNING *",
      [cartId, productId, quantity]
    );

    if (rows.length === 0) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Product not found in cart");
    }

    return rows[0];
  },
  removeProductFromCart: async (cartId: number, productId: number) => {
    const { rows } = await db.query(
      "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING *",
      [cartId, productId]
    );

    if (rows.length === 0) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Product not found in cart");
    }
  },
  delete: async (cartId: number) => {
    await db.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);

    await db.query("DELETE FROM carts WHERE id = $1", [cartId]);
  },
};
