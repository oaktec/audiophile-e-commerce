import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

import { userService } from ".";

export default {
  loginUser: async (email: string, password: string) => {
    const user = await userService.getByEmail(email);
    if (user.length === 0) {
      throw createHttpError(
        StatusCodes.UNAUTHORIZED,
        "No user found with that email and password"
      );
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      throw createHttpError(
        StatusCodes.UNAUTHORIZED,
        "No user found with that email and password"
      );
    }

    delete user[0].password;

    return user;
  },
  registerUser: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    address: string
  ) => {
    const user = await userService.getByEmail(email);
    if (user.length > 0) {
      throw createHttpError(StatusCodes.CONFLICT, "Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await userService.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      address,
    });

    delete result.password;

    return result;
  },
};
