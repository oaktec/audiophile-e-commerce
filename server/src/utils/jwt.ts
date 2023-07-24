import jwt, { JwtPayload } from "jsonwebtoken";

export default {
  generateToken: (id: number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
      expiresIn: "30d",
    });
  },
  verifyToken: (token: string) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded === "object" && "id" in decoded) {
      return decoded as JwtPayload;
    } else {
      throw new Error("Invalid token");
    }
  },
};
