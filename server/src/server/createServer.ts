import express from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

import routes from "../routes";
import { authMiddleware, errorHandlingMiddleware } from "../middlewares";

const createServer = () => {
  const app = express();

  const corsOptions = {
    origin: process.env.CORS_CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: StatusCodes.OK,
  };

  app.use(
    morgan("dev"),
    cors(corsOptions),
    helmet(),
    express.json(),
    express.urlencoded({ extended: true })
  );

  app.use(authMiddleware.authorize, routes);

  // Temporary 404 handler
  app.get("/*", (req, res) => {
    res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
  });

  app.use(errorHandlingMiddleware);

  return app;
};

export default createServer;
