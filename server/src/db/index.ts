import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

export default {
  query: (text: string, params: any) => pool.query(text, params),
};
