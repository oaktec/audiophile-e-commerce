import dotenv from "dotenv";
import fs from "fs";

if (!process.env.CI && fs.existsSync(".env")) {
  const result = dotenv.config();
  if (result.error) {
    throw result.error;
  }
}

export const NODE_ENV = process.env.NODE_ENV || "development";

const ensureEnvVar = (
  name: string,
  condition: boolean = true,
  defaultValue?: string
) => {
  if (!process.env[name]) {
    if (condition) {
      throw new Error(`The ${name} environment variable must be defined`);
    } else if (defaultValue) {
      return defaultValue;
    }
  }
  return process.env[name];
};

export const PORT = ensureEnvVar("PORT");
export const SESSION_SECRET = ensureEnvVar(
  "SESSION_SECRET",
  NODE_ENV === "production",
  "secret"
);
export const CORS_CLIENT_URL = ensureEnvVar(
  "CORS_CLIENT_URL",
  NODE_ENV === "production",
  "http://localhost:5173"
);
export const STRIPE_SECRET_KEY = ensureEnvVar("STRIPE_SECRET_KEY");

const DB_HOST = ensureEnvVar("DB_HOST", NODE_ENV !== "production");
const DB_NAME = ensureEnvVar("DB_NAME", NODE_ENV !== "production");
const DB_USER = ensureEnvVar("DB_USER", NODE_ENV !== "production");
const DB_PASSWORD = ensureEnvVar("DB_PASSWORD", NODE_ENV !== "production");
const DB_PORT = ensureEnvVar("DB_PORT", NODE_ENV !== "production");
export const DATABASE_URL = ensureEnvVar(
  "DATABASE_URL",
  false,
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
);

const TEST_DB_HOST = ensureEnvVar("TEST_DB_HOST", NODE_ENV === "test");
const TEST_DB_NAME = ensureEnvVar("TEST_DB_NAME", NODE_ENV === "test");
export const TEST_DATABASE_URL = ensureEnvVar(
  "TEST_DATABASE_URL",
  false,
  `postgres://${DB_USER}:${DB_PASSWORD}@${TEST_DB_HOST}:${DB_PORT}/${TEST_DB_NAME}`
);
