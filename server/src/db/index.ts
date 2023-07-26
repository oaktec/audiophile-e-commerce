import dotenv from "dotenv";
dotenv.config();
import { Pool, QueryResult } from "pg";

const validTables = [
  "users",
  "products",
  "orders",
  "carts",
  "cart_items",
  "categories",
];
const validFields = [
  "id",
  "email",
  "password",
  "first_name",
  "last_name",
  "address",
  "name",
  "description",
  "price",
  "category_id",
  "status",
  "cart_id",
  "order_date",
  "user_id",
  "product_id",
  "quantity",
];

const pool = new Pool({
  host:
    process.env.NODE_ENV === "test"
      ? process.env.TEST_DB_HOST
      : process.env.DB_HOST,
  database:
    process.env.NODE_ENV === "test"
      ? process.env.TEST_DB_NAME
      : process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD as string | undefined,
  port: Number(process.env.DB_PORT),
});

export default {
  query: (text: string, params?: (string | number)[]) =>
    pool.query(text, params),
  queryCallback: (
    text: string,
    callback: (err: Error, res: QueryResult) => void
  ) => pool.query(text, callback),
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
