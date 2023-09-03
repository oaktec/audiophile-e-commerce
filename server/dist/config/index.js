"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_DATABASE_URL = exports.DATABASE_URL = exports.STRIPE_SECRET_KEY = exports.CORS_CLIENT_URL = exports.SESSION_SECRET = exports.PORT = exports.NODE_ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
if (!process.env.CI && fs_1.default.existsSync(".env")) {
    const result = dotenv_1.default.config();
    if (result.error) {
        throw result.error;
    }
}
exports.NODE_ENV = process.env.NODE_ENV || "development";
const ensureEnvVar = (name, condition = true, defaultValue) => {
    if (!process.env[name]) {
        if (condition) {
            throw new Error(`The ${name} environment variable must be defined`);
        }
        else if (defaultValue) {
            return defaultValue;
        }
    }
    return process.env[name];
};
exports.PORT = ensureEnvVar("PORT");
exports.SESSION_SECRET = ensureEnvVar("SESSION_SECRET", exports.NODE_ENV === "production", "secret");
exports.CORS_CLIENT_URL = ensureEnvVar("CORS_CLIENT_URL", exports.NODE_ENV === "production", "http://localhost:5173");
exports.STRIPE_SECRET_KEY = ensureEnvVar("STRIPE_SECRET_KEY", exports.NODE_ENV !== "test");
const DB_HOST = ensureEnvVar("DB_HOST", exports.NODE_ENV !== "production");
const DB_NAME = ensureEnvVar("DB_NAME", exports.NODE_ENV !== "production");
const DB_USER = ensureEnvVar("DB_USER", exports.NODE_ENV !== "production");
const DB_PASSWORD = ensureEnvVar("DB_PASSWORD", exports.NODE_ENV !== "production");
const DB_PORT = ensureEnvVar("DB_PORT", exports.NODE_ENV !== "production");
exports.DATABASE_URL = ensureEnvVar("DATABASE_URL", false, `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);
const TEST_DB_HOST = ensureEnvVar("TEST_DB_HOST", exports.NODE_ENV === "test");
const TEST_DB_NAME = ensureEnvVar("TEST_DB_NAME", exports.NODE_ENV === "test");
exports.TEST_DATABASE_URL = ensureEnvVar("TEST_DATABASE_URL", false, `postgres://${DB_USER}:${DB_PASSWORD}@${TEST_DB_HOST}:${DB_PORT}/${TEST_DB_NAME}`);
