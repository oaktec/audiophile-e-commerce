import { Request, Response, NextFunction } from "express";
import createHttpError, { isHttpError } from "http-errors";
import { StatusCodes } from "http-status-codes";

const errorHandlingMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error;
  if (isHttpError(err)) {
    error = err;
  } else {
    console.error(err);
    error = createHttpError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      err.message ?? "Unknown error occurred"
    );
  }

  const errorRet = {
    message: error.message || "An unknown error occurred",
    status: error.statusCode || 500,
    name: error.name || "UnknownError",
  };

  console.log(errorRet);

  res.status(error.statusCode).json(errorRet);
};

export default errorHandlingMiddleware;
