import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

import { userService } from "../services";
import { validationMiddleware } from "../middlewares";

export default {
  getUserById: async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.userId);

    const unsafeUser = await userService.getById(id);

    if (!unsafeUser) {
      return next(createHttpError(404, "User not found"));
    }

    res.json({
      id: unsafeUser.id,
      email: unsafeUser.email,
      firstName: unsafeUser.firstName,
      lastName: unsafeUser.lastName,
      address: unsafeUser.address,
    });
  },
  updateUserById: [
    validationMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      const id = Number(req.params.userId);

      const unsafeUser = await userService.getById(id);

      if (!unsafeUser) {
        return next(createHttpError(404, "User not found"));
      }

      const { email, password, firstName, lastName, address } = req.body;

      if (email !== unsafeUser.email) {
        const existingUser = await userService.getByEmail(email);
        if (existingUser) {
          return next(createHttpError(409, "Email already in use"));
        }
      }

      const updateData: {
        email?: string;
        password?: string;
        firstName?: string;
        lastName?: string;
        address?: string;
      } = {
        email,
        firstName,
        lastName,
        address,
      };

      let hashedPassword;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }

      const updatedUser = await userService.updateById(id, updateData);

      if (!updatedUser) {
        return next(createHttpError(500, "Failed to update user"));
      }

      res.json({
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        address: updatedUser.address,
      });
    },
  ],
  deleteUserById: async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.userId);

    const unsafeUser = await userService.getById(id);

    if (!unsafeUser) {
      return next(createHttpError(404, "User not found"));
    }

    const deletedUser = await userService.deleteById(id);

    if (!deletedUser) {
      return next(createHttpError(500, "Failed to delete user"));
    }

    res.status(StatusCodes.NO_CONTENT).send();
  },
};
