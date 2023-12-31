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
  getProducts: async (cartId: number) => {
    const { rows } = await db.query(
      "SELECT * FROM cart_items WHERE cart_id = $1",
      [cartId]
    );

    return rows;
  },
  checkout: async (
    userId: number,
    cartId: number,
    address: string,
    postcode: string,
    city: string,
    paymentMethod: string,
    paymentParams: {
      eMoneyNumber?: string;
      eMoneyPin?: string;
    },
    phone?: string
  ) => {
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

    const client = await db.getClient();

    try {
      await client.query("BEGIN");

      if (!phone)
        await client.query(
          "INSERT INTO orders (user_id, cart_id, address, postcode, city, payment_method) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
          [userId, cartId, address, postcode, city, paymentMethod]
        );
      else
        await client.query(
          "INSERT INTO orders (user_id, cart_id, address, postcode, city, payment_method, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
          [userId, cartId, address, postcode, city, paymentMethod, phone]
        );

      await client.query("UPDATE carts SET active = false WHERE id = $1", [
        cartId,
      ]);

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(err);
      throw createHttpError(StatusCodes.BAD_REQUEST, "Failed to checkout cart");
    } finally {
      client.release();
    }
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
    const { rows: existingProductRows } = await db.query(
      "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2",
      [cartId, productId]
    );

    const { rows } = await db.query(
      existingProductRows.length > 0
        ? "UPDATE cart_items SET quantity = $3 WHERE cart_id = $1 AND product_id = $2 RETURNING *"
        : "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [
        cartId,
        productId,
        existingProductRows.length > 0
          ? quantity + existingProductRows[0].quantity
          : quantity,
      ]
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
