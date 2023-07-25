import { config } from "dotenv";
if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test" });
} else {
  config();
}
import express from "express";

import routes from "./routes";
import { authMiddleware } from "./middlewares";
import { StatusCodes } from "http-status-codes";
import db from "./db";

const app = express();

app.use(express.json(), express.urlencoded({ extended: true }));

app.use(authMiddleware.authorize, routes);

// Temporary error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Something broke!");
});

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
