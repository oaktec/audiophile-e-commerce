import db from "../db";

interface DBProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  slug: string;
  new: boolean;
  features: string;
}

interface DBSimilarProduct {
  product_id: number;
  similar_product_id: number;
}

interface DBProductBoxContents {
  product_id: number;
  item: string;
  quantity: number;
}
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  features: string;
  slug: string;
  new: boolean;
}
interface FullProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  slug: string;
  new: boolean;
  features: string;
  similarProducts: string[];
  boxContents: { item: string; quantity: number }[];
}

const fullMapProduct = async (product: DBProduct): Promise<FullProduct> => {
  const { rows: similarRows } = await db.query(
    `SELECT similar_product_id FROM similar_products WHERE product_id = $1`,
    [product.id]
  );

  const similarProductSlugs = similarRows.map(
    async (row: DBSimilarProduct): Promise<string> => {
      const { rows } = await db.query(
        `SELECT slug FROM products WHERE id = $1`,
        [row.similar_product_id]
      );

      return rows[0].slug;
    }
  );

  const { rows } = await db.query(
    `SELECT item, quantity FROM product_box_contents WHERE product_id = $1`,
    [product.id]
  );

  const boxContents = rows.map(
    (row: DBProductBoxContents): { item: string; quantity: number } => ({
      item: row.item,
      quantity: row.quantity,
    })
  );

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    categoryId: product.category_id,
    slug: product.slug,
    features: product.features,
    new: product.new,
    similarProducts: await Promise.all(similarProductSlugs),
    boxContents,
  };
};
const mapProduct = (product: DBProduct): Product => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  categoryId: product.category_id,
  slug: product.slug,
  features: product.features,
  new: product.new,
});

export default {
  getAll: async (): Promise<Product[]> => {
    const { rows } = await db.query("SELECT * FROM products");

    return rows.map(mapProduct);
  },
  getByIds: async (ids: number[]): Promise<Product[]> => {
    const { rows } = await db.query(
      `SELECT * FROM products WHERE id = ANY ($1)`,
      [ids]
    );
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

    return fullMapProduct(product);
  },
  getBySlug: async (slug: string): Promise<Product | null> => {
    const { rows } = await db.getByField("products", "slug", slug);

    if (rows.length === 0) {
      return null;
    }

    const product = rows[0];

    return fullMapProduct(product);
  },
};
