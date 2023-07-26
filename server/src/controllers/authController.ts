import { NextFunction, Request, Response } from "express";

import { authService } from "../services";
import jwt from "../utils/jwt";
import { StatusCodes } from "http-status-codes";
import { validationMiddleware } from "../middlewares";
import createHttpError from "http-errors";

export default {
  loginUser: [
    validationMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body;

        const result = await authService.loginUser(email, password);

        if (!result || result.length === 0) {
          throw createHttpError(
            StatusCodes.UNAUTHORIZED,
            "No user found with that email and password"
          );
        }

        const token = jwt.generateToken(result[0].id);

        res.status(StatusCodes.OK).json({
          id: result[0].id,
          token,
        });
      } catch (err) {
        next(err);
      }
    },
  ],
  registerUser: [
    validationMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password, firstName, lastName, address } = req.body;
        const result = await authService.registerUser(
          email,
          password,
          firstName,
          lastName,
          address
        );

        const token = jwt.generateToken(result.id);

        res.status(StatusCodes.CREATED).json({
          id: result.id,
          token: token,
        });
      } catch (err) {
        next(err);
      }
    },
  ],
};
