import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  database: "audiophile-e-commerce",
});

export default {
  query: (text: string, params: any) => pool.query(text, params),
};
