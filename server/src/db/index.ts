import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

export default {
  query: (text: string, params: any) => pool.query(text, params),
  getByField: async (table: string, field: string, value: string | number) => {
    const result = await pool.query(
      `SELECT * FROM ${table} WHERE ${field} = $1`,
      [value]
    );

    return result;
  },
};
