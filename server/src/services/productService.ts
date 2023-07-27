import db from "../db";

interface DBProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
}

const mapProduct = (product: DBProduct): Product => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  categoryId: product.category_id,
});

export default {
  getAll: async (): Promise<Product[]> => {
    const { rows } = await db.query("SELECT * FROM products");

    return rows.map(mapProduct);
  },
  getByCategory: async (categoryId: number): Promise<Product[]> => {
    const { rows } = await db.query(
      "SELECT * FROM products WHERE category_id = $1",
      [categoryId]
    );

    return rows.map(mapProduct);
  },
};
