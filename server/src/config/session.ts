import session from "express-session";
import pgSession from "connect-pg-simple";

import db from "../db";

const sessionStore =
  process.env.NODE_ENV === "test"
    ? undefined
    : new (pgSession(session))(db.sessionStorage);

export default session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  },
});
