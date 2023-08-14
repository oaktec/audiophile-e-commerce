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
  "products",
  "users",
];
const validFields = [
  "active",
  "address",
  "cart_id",
  "category_id",
  "description",
  "email",
  "first_name",
  "id",
  "last_name",
  "name",
  "order_date",
  "password",
  "price",
  "product_id",
  "quantity",
  "status",
  "user_id",
];

const pool = new Pool({
  connectionString: NODE_ENV === "test" ? TEST_DATABASE_URL : DATABASE_URL,
});

if (process.env.SEED_DB === "true") {
  seedData().catch(console.error);
}

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
  },
};
