import dotenv from "dotenv";
dotenv.config();
import { Pool } from "pg";

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
  query: (text: string, params?: any) => pool.query(text, params),
  getByField: async (table: string, field: string, value: string | number) => {
    const result = await pool.query(
      `SELECT * FROM ${table} WHERE ${field} = $1`,
      [value]
    );

    return result;
  },
  end: () => pool.end(),
};
