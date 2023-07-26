import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";

const { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET env var. Set it and restart the server");
}

export default {
  generateToken: (id: number) => {
    return jwt.sign({ id }, JWT_SECRET, {
      expiresIn: "30d",
    });
  },
  verifyToken: (token: string): JwtPayload | never => {
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      throw createHttpError(StatusCodes.UNAUTHORIZED, "Invalid token");
    }

    if (decoded && typeof decoded === "object" && "id" in decoded) {
      return decoded as JwtPayload;
    } else {
      throw createHttpError(
        StatusCodes.UNAUTHORIZED,
        "Invalid token structure"
      );
    }
  },
};
