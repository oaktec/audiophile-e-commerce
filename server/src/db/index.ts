import dotenv from "dotenv";
dotenv.config();
import { Pool, QueryResult } from "pg";

import { NODE_ENV, TEST_DATABASE_URL, DATABASE_URL } from "../config";
import { seedData } from "./seedDb";

export const validTables = [
  "carts",
  "cart_items",
  "categories",
  "orders",
  "product_box_contents",
  "products",
  "similar_products",
  "users",
];
const validFields = [
  "active",
  "address",
  "cart_id",
  "category_id",
  "description",
  "email",
  "features",
  "first_name",
  "id",
  "item_id",
  "last_name",
  "name",
  "new",
  "order_date",
  "password",
  "price",
  "product_id",
  "quantity",
  "similar_product_id",
  "slug",
  "status",
  "user_id",
];

const pool = new Pool({
  connectionString: NODE_ENV === "test" ? TEST_DATABASE_URL : DATABASE_URL,
});

export default {
  getClient: async () => await pool.connect(),
  query: (text: string, params?: (string | number)[]) =>
    pool.query(text, params),
  queryCallback: (
    text: string,
    callback: (err: Error, res: QueryResult) => void
  ) => pool.query(text, callback),
  queryAllowUndefined: (
    text: string,
    params?: (string | number | undefined)[]
  ) => pool.query(text, params),
  getByField: async (table: string, field: string, value: string | number) => {
    if (!validTables.includes(table) || !validFields.includes(field)) {
      throw new Error("Invalid table or field");
    }

    const result = await pool.query(
      `SELECT * FROM ${table} WHERE ${field} = $1`,
      [value]
    );

    return result;
  },
  end: () => pool.end(),
  checkConnection: () =>
    new Promise<QueryResult>((resolve, reject) => [
      pool.query("SELECT NOW()", (err: Error | null, res: QueryResult) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }),
    ]),
  sessionStorage: {
    pool,
    tableName: "session",
    createTableIfMissing: true,
  },
};

if (process.env.SEED_DB === "true" && NODE_ENV !== "test") {
  seedData().catch(console.error);
}
