import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import createHttpError from "http-errors";
import passport from "passport";
import bcrypt from "bcrypt";

import { userService } from "../services";
import { validationMiddleware } from "../middlewares";

export default {
  loginUser: [
    (req: Request, res: Response, next: NextFunction) => {
      try {
        passport.authenticate(
          "local",
          (err: Error | null, user: Express.User | undefined) => {
            if (err) {
              return next(err);
            }

            if (!user) {
              return next(
                createHttpError(
                  StatusCodes.BAD_REQUEST,
                  "Incorrect email or password"
                )
              );
            }

            req.logIn(user, (err) => {
              if (err) {
                return next(err);
              }

              return res.json({
                id: user.id,
              });
            });
          }
        )(req, res, next);
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

        const existingUser = await userService.getByEmail(email);
        if (existingUser) {
          throw createHttpError(StatusCodes.CONFLICT, "Email already in use");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userService.create({
          email,
          password: hashedPassword,
          firstName,
          lastName,
          address,
        });

        if (!user) {
          return next(
            createHttpError(
              StatusCodes.INTERNAL_SERVER_ERROR,
              "User could not be created"
            )
          );
        }

        res.status(StatusCodes.CREATED).json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address,
        });
      } catch (err) {
        next(err);
      }
    },
  ],
};
