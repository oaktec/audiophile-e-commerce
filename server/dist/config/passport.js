"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const services_1 = require("../services");
const LocalStrategy = passport_local_1.default.Strategy;
passport_1.default.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
}, async (email, password, done) => {
    try {
        const user = await services_1.userService.getByEmail(email.toLowerCase());
        if (!user || !user.password) {
            return done(null, false, {
                message: "No user found with that email and password",
            });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, {
                message: "No user found with that email and password",
            });
        }
        const safeUser = services_1.userService.makeSafe(user);
        return done(null, safeUser);
    }
    catch (err) {
        return done(err);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await services_1.userService.getById(id);
        if (!user) {
            return done(null, false);
        }
        const safeUser = services_1.userService.makeSafe(user);
        done(null, safeUser);
    }
    catch (err) {
        done(err);
    }
});
exports.default = passport_1.default;
