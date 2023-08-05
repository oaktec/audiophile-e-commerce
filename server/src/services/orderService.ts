import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

import db from "../db";
import productService, { Product } from "./productService";

interface DBOrder {
  id: number;
  user_id: number;
  cart_id: number;
  status: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: number;
  userId: number;
  cartId: number;
  status: string;
  items: OrderItem[];
  total: number;
}

const mapOrder = (order: DBOrder): Order => ({
  id: order.id,
  userId: order.user_id,
  cartId: order.cart_id,
  status: order.status,
  items: [],
  total: 0,
});

const populateOrder = async (order: DBOrder): Promise<Order> => {
  const populatedOrder = mapOrder(order);

  const items = await db.query("SELECT * FROM cart_items WHERE cart_id = $1", [
    populatedOrder.cartId,
  ]);

  populatedOrder.items = await Promise.all(
    items.rows.map(async (item) => {
      const product = await productService.getById(item.product_id);

      if (!product) {
        throw createHttpError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Failed to find product while populating order"
        );
      }

      return {
        product,
        quantity: item.quantity,
      };
    })
  );

  populatedOrder.total = populatedOrder.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return populatedOrder;
};

export default {
  getAllOrdersByUserId: async (userId: number): Promise<Order[]> => {
    const orders = await db.query("SELECT * FROM orders WHERE user_id = $1", [
      userId,
    ]);

    return Promise.all(orders.rows.map(populateOrder));
  },
  getOrderById: async (id: number): Promise<Order | null> => {
    const { rows } = await db.query("SELECT * FROM orders WHERE id = $1", [id]);

    if (rows.length === 0) {
      return null;
    }

    return populateOrder(rows[0]);
  },
};
