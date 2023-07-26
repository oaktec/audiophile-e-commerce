import dotenv from "dotenv";
dotenv.config();
import { Pool, QueryResult } from "pg";

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
    const result = await pool.query(
      `SELECT * FROM ${table} WHERE ${field} = $1`,
      [value]
    );

    return result;
  },
  end: () => pool.end(),
};
