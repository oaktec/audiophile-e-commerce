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
    },
  ],
  registerUser: [
    validationMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password, firstName, lastName, address } = req.body;
      const existingUser = await userService.getByEmail(email);
      if (existingUser) {
        return next(
          createHttpError(StatusCodes.CONFLICT, "Email already in use")
        );
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

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        return res.status(StatusCodes.CREATED).json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address,
        });
      });
    },
  ],
  logoutUser: (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          return next(destroyErr);
        }
        return res.status(StatusCodes.NO_CONTENT).end();
      });
    });
  },
  checkSession: async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      const user = await userService.getById(req.user.id);

      if (!user) {
        return next(createHttpError(StatusCodes.NOT_FOUND, "User not found"));
      }

      return res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
      });
    }
    return res.status(StatusCodes.UNAUTHORIZED).end();
  },
};
