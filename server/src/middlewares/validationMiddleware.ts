import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationError } from "express-validator";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

const validationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    if (!firstError) {
      return next(
        createHttpError(
          StatusCodes.BAD_REQUEST,
          "An unknown validation error occurred"
        )
      );
    }
    return next(createHttpError(StatusCodes.BAD_REQUEST, firstError.msg));
  }
  next();
};

export default validationMiddleware;
