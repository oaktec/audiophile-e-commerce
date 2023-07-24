import express from "express";
import { config } from "dotenv";
import routes from "./routes";
import { authMiddleware } from "./middlewares";
import { StatusCodes } from "http-status-codes";

if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test" });
} else {
  config();
}

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

export default app;
