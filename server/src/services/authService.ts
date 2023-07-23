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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await userService.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      address,
    });

    return result;
  },
};
