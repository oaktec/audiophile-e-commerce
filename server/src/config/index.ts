import dotenv from "dotenv";
const result = dotenv.config();
if (result.error) {
  throw result.error;
}

export const NODE_ENV = process.env.NODE_ENV || "development";

if (!process.env.PORT) {
  throw new Error("The PORT environment variable must be defined");
}
export const PORT = process.env.PORT;

if (!process.env.SESSION_SECRET) {
  if (NODE_ENV === "production") {
    throw new Error("The SESSION_SECRET environment variable must be defined");
  } else if (NODE_ENV !== "test") {
    console.warn(
      "The SESSION_SECRET environment variable is not defined. A default value can be used in non-production environments, but you should add a value to the environment variable in production"
    );
  }
}
export const SESSION_SECRET = process.env.SESSION_SECRET || "secret";

if (!process.env.CORS_CLIENT_URL) {
  if (NODE_ENV === "production") {
    throw new Error("The CORS_CLIENT_URL environment variable must be defined");
  } else if (NODE_ENV !== "test") {
    console.warn(
      "The CORS_CLIENT_URL environment variable is not defined. A default value can be used in non-production environments, but you should add a value to the environment variable in production"
    );
  }
}
export const CORS_CLIENT_URL =
  process.env.CORS_CLIENT_URL || "http://localhost:3000";

if (!process.env.DB_HOST) {
  throw new Error("The DB_HOST environment variable must be defined");
}
export const DB_HOST = process.env.DB_HOST;

if (!process.env.DB_NAME) {
  throw new Error("The DB_NAME environment variable must be defined");
}
export const DB_NAME = process.env.DB_NAME;

if (!process.env.DB_USER) {
  throw new Error("The DB_USER environment variable must be defined");
}
export const DB_USER = process.env.DB_USER;

if (!process.env.DB_PASSWORD) {
  throw new Error("The DB_PASSWORD environment variable must be defined");
}
export const DB_PASSWORD = process.env.DB_PASSWORD;

if (!process.env.DB_PORT) {
  throw new Error("The DB_PORT environment variable must be defined");
}
export const DB_PORT = process.env.DB_PORT;

if (!process.env.TEST_DB_HOST) {
  if (NODE_ENV === "test") {
    throw new Error("The TEST_DB_HOST environment variable must be defined");
  }
}
export const TEST_DB_HOST = process.env.TEST_DB_HOST;

if (!process.env.TEST_DB_NAME) {
  if (NODE_ENV === "test") {
    throw new Error("The TEST_DB_NAME environment variable must be defined");
  }
}
export const TEST_DB_NAME = process.env.TEST_DB_NAME;
