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
};
