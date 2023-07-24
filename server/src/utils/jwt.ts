import jwt from "jsonwebtoken";

export default {
  generateToken: (id: number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
      expiresIn: "30d",
    });
  },
  verifyToken: (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET!);
  },
};
