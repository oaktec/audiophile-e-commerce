import passport from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";

import { userService } from "../services";

const LocalStrategy = passportLocal.Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const user = await userService.getByEmail(email);

        if (!user || !user.password) {
          return done(null, false, {
            message: "No user found with that email and password",
          });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return done(null, false, {
            message: "No user found with that email and password",
          });
        }

        const safeUser = userService.makeSafe(user);
        return done(null, safeUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await userService.getById(id);

    if (!user) {
      return done(null, false);
    }

    const safeUser = userService.makeSafe(user);
    done(null, safeUser);
  } catch (err) {
    done(err);
  }
});

export default passport;
