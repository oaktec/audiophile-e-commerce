import bcrypt from "bcrypt";

import { userService } from ".";

export default {
  loginUser: async (email: string, password: string) => {
    const user = await userService.getByEmail(email);
    if (user.length === 0) {
      throw new Error("Incorrect email or password");
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      throw new Error("Incorrect email or password");
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
      throw new Error("User with that email already exists");
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
