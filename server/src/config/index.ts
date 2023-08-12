import dotenv from "dotenv";

if (!process.env.CI) {
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
  "http://localhost:3000"
);
export const DB_HOST = ensureEnvVar("DB_HOST");
export const DB_NAME = ensureEnvVar("DB_NAME");
export const DB_USER = ensureEnvVar("DB_USER");
export const DB_PASSWORD = ensureEnvVar("DB_PASSWORD");
export const DB_PORT = ensureEnvVar("DB_PORT");
export const TEST_DB_HOST = ensureEnvVar("TEST_DB_HOST", NODE_ENV === "test");
export const TEST_DB_NAME = ensureEnvVar("TEST_DB_NAME", NODE_ENV === "test");
