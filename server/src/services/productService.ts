import db from "../db";

interface DBProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  slug: string;
}

const mapProduct = (product: DBProduct): Product => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  categoryId: product.category_id,
  slug: product.slug,
});

export default {
  getAll: async (): Promise<Product[]> => {
    const { rows } = await db.query("SELECT * FROM products");

    return rows.map(mapProduct);
  },
  getByCategory: async (categoryName: string): Promise<Product[]> => {
    const { rows } = await db.query(
      "SELECT * FROM products WHERE category_id = (SELECT id FROM categories WHERE name = $1)",
      [categoryName]
    );

    return rows.map(mapProduct);
  },
  getById: async (id: number): Promise<Product | null> => {
    const { rows } = await db.getByField("products", "id", id);

    if (rows.length === 0) {
      return null;
    }

    const product = rows[0];

    return mapProduct(product);
  },
};
