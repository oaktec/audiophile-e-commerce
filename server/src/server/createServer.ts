import express from "express";
import "express-async-errors";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

import routes from "../routes";
import { errorHandlingMiddleware } from "../middlewares";
import session from "../config/session";
import passport from "../config/passport";
import { NODE_ENV, CORS_CLIENT_URL } from "../config";

const createServer = () => {
  const app = express();

  const corsOptions = {
    origin: CORS_CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: StatusCodes.OK,
  };

  let morganFormat = "";
  switch (NODE_ENV) {
    case "production":
      morganFormat = "combined";
      break;
    case "test":
      break;
    default:
      morganFormat = "dev";
      break;
  }

  if (morganFormat) {
    app.use(morgan(morganFormat));
  }

  app.use(
    cors(corsOptions),
    helmet(),
    express.json(),
    express.urlencoded({ extended: true })
  );

  app.use(session);

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(routes);

  // Temporary 404 handler
  app.all("/*", (req, res) => {
    res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
  });

  app.use(errorHandlingMiddleware);

  return app;
};

export default createServer;
