import express from "express";
import { config } from "dotenv";
config();

import routes from "./routes";
import { authMiddleware } from "./middlewares";

const app = express();

app.use(express.json(), express.urlencoded(), authMiddleware.authorize, routes);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
