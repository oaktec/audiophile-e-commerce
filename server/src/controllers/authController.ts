import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { authService } from "../services";
import jwt from "../utils/jwt";
import { StatusCodes } from "http-status-codes";
import { validationMiddleware } from "../middlewares";

export default {
  loginUser: [
    validationMiddleware,
    async (req: Request, res: Response) => {
      try {
        const { email, password } = req.body;

        const result = await authService.loginUser(email, password);

        if (!result || result.length === 0) {
          throw new Error("No user found");
        }

        const token = jwt.generateToken(result[0].id);

        res.status(StatusCodes.OK).json({
          id: result[0].id,
          token,
        });
      } catch (err) {
        if (err instanceof Error) {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: err.message,
          });
        } else {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An unknown error occurred",
          });
        }
      }
    },
  ],
  registerUser: [
    validationMiddleware,
    async (req: Request, res: Response) => {
      try {
        const { email, password, firstName, lastName, address } = req.body;
        const result = await authService.registerUser(
          email,
          password,
          firstName,
          lastName,
          address
        );

        res.status(StatusCodes.CREATED).json({
          id: result.id,
        });
      } catch (err) {
        if (err instanceof Error) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: err.message,
          });
        } else {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An unknown error occurred",
          });
        }
      }
    },
  ],
};
