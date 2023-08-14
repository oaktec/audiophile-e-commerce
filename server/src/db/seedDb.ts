import { PoolClient } from "pg";
import { readFileSync } from "fs";
import * as path from "path";

import db, { validTables } from ".";

interface SeedData {
  slug: string;
  name: string;
  image: ResponsiveImage;
  category: string;
  categoryImage: ResponsiveImage;
  new: boolean;
  price: number;
  description: string;
  features: string;
  includes: Part[];
  gallery: ResponsiveImage[];
  relatedProducts: string[];
}

interface ResponsiveImage {
  mobile: string;
  tablet: string;
  desktop: string;
}

interface Part {
  quantity: number;
  item: string;
}

export const seedData = async () => {
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    await createTables(client);

    //  Clear tables if necessary
    for (const table of validTables) {
      await client.query(`DELETE FROM ${table} CASCADE`);
    }

    const dataFilePath = path.resolve(__dirname, "../data/data.json");

    // Read ../data/data.json
    const data = JSON.parse(readFileSync(dataFilePath, "utf8")) as SeedData[];

    // Grab categories
    const categories = data.reduce((acc: string[], curr: SeedData) => {
      if (!acc.includes(curr.category)) {
        acc.push(curr.category);
      }
      return acc;
    }, []);

    // Insert categories
    for (const category of categories) {
      await client.query(`INSERT INTO categories (name) VALUES ($1)`, [
        category,
      ]);
    }

    // Insert products
    for (const product of data) {
      const categoryId = await client.query(
        `SELECT id FROM categories WHERE name = $1`,
        [product.category]
      );
      await client.query(
        `INSERT INTO products (name, description, price, category_id) VALUES ($1, $2, $3, $4)`,
        [
          product.name,
          product.description,
          product.price,
          categoryId.rows[0].id,
        ]
      );
    }

    console.info("Seeding complete");
    await client.query("COMMIT");
  } catch (err) {
    console.error("Error seeding database");
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const createTables = async (client: PoolClient) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email text NOT NULL UNIQUE,
      password text NOT NULL,
      first_name text NOT NULL,
      last_name text NOT NULL,
      address text NOT NULL
    )`);

  await client.query(`CREATE TABLE IF NOT EXISTS categories (
   id SERIAL PRIMARY KEY,
   name text NOT NULL
 )`);

  await client.query(`CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    description text,
    price decimal NOT NULL,
    category_id integer NOT NULL REFERENCES categories(id)
  )`);

  await client.query(`CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id),
    active boolean NOT NULL DEFAULT TRUE
  )`);

  await client.query(`CREATE TABLE IF NOT EXISTS cart_items (
    cart_id integer NOT NULL REFERENCES carts(id),
    product_id integer NOT NULL REFERENCES products(id),
    quantity integer NOT NULL,
    PRIMARY KEY (cart_id, product_id)
  )`);

  await client.query(`CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id),
    cart_id integer NOT NULL REFERENCES carts(id),
    order_date timestamp NOT NULL DEFAULT NOW(),
    status text
  )`);
};
