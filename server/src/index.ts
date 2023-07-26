import { config } from "dotenv";
config();

import db from "./db";
import createServer from "./server/createServer";

const app = createServer();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

db.query("SELECT NOW()", (err: any, res: any) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`PostgreSQL connected: ${res.rows[0].now}`);
  }
});

export default app;
