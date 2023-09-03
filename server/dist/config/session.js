"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = __importDefault(require("express-session"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
const db_1 = __importDefault(require("../db"));
const _1 = require(".");
const sessionStore = _1.NODE_ENV === "test" ? undefined : new ((0, connect_pg_simple_1.default)(express_session_1.default))(db_1.default.sessionStorage);
exports.default = (0, express_session_1.default)({
    store: sessionStore,
    secret: _1.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 30,
    },
});
