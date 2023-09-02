import session from "express-session";
import pgSession from "connect-pg-simple";

import db from "../db";
import { NODE_ENV, SESSION_SECRET } from ".";

const sessionStore =
  NODE_ENV === "test" ? undefined : new (pgSession(session))(db.sessionStorage);

export default session({
  store: sessionStore,
  secret: SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: NODE_ENV !== "development",
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  },
});
