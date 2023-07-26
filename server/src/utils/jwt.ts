import jwt, { JwtPayload } from "jsonwebtoken";

interface ITokenPayload extends JwtPayload {
  id: number;
}

const { JWT_SECRET } = process.env;
const TOKEN_EXPIRATION = "30d";

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET env var. Set it and restart the server");
}

export default {
  generateToken: (id: number): string => {
    return jwt.sign({ id }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRATION,
    });
  },
  verifyToken: (token: string): ITokenPayload | null => {
    const decoded = jwt.verify(token, JWT_SECRET) as ITokenPayload;

    if ("id" in decoded) {
      return decoded;
    }

    return null;
  },
};
