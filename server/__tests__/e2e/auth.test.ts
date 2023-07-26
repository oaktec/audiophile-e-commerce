/* eslint-disable camelcase */
import request from "supertest";
import { Server } from "http";

import { StatusCodes } from "http-status-codes";

import db from "../../src/db";
import { clearDatabase, createTestServer } from "../utils/testHelpers";

let server: Server;

beforeAll(async () => {
  server = await createTestServer();
});

afterAll(async () => {
  await db.end();
  server.close();
});

describe("auth", () => {
  afterEach(async () => {
    await clearDatabase();
  });

  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(server).post("/auth/register").send({
        email: "test@user.com",
        password: "Password123!",
        firstName: "Test",
        lastName: "User",
        address: "123 Test St",
      });

      expect(res.status).toEqual(StatusCodes.CREATED);
      expect(res.body).toEqual({
        id: expect.any(Number),
        email: "test@user.com",
        firstName: "Test",
        lastName: "User",
        address: "123 Test St",
      });

      const dbRes = await db.query("SELECT * FROM users");
      expect(dbRes.rows.length).toEqual(1);
      expect(dbRes.rows[0]).toEqual({
        id: expect.any(Number),
        email: "test@user.com",
        password: expect.any(String),
        first_name: "Test",
        last_name: "User",
        address: "123 Test St",
      });

      expect(dbRes.rows[0].password).not.toEqual("Password123!");
      expect(res.body.password).toBeUndefined();
      expect(res.body.id).toEqual(dbRes.rows[0].id);
    });

    it("should return an error if email is already in use", async () => {
      await db.query(
        "INSERT INTO users (email, password, first_name, last_name, address) VALUES ($1, $2, $3, $4, $5)",
        ["test@user.com", "Password123!", "Test", "User", "123 Test St"]
      );

      const res = await request(server).post("/auth/register").send({
        email: "test@user.com",
        password: "AnotherPassword123!",
        firstName: "Testy",
        lastName: "User",
        address: "123 Test St, Bristol",
      });

      expect(res.status).toEqual(StatusCodes.CONFLICT);
      expect(res.body).toEqual({
        message: "Email already in use",
        name: "ConflictError",
        status: 409,
      });

      const dbRes = await db.query("SELECT * FROM users");
      expect(dbRes.rows.length).toEqual(1);
    });

    it("should return an error if email is already in use (case insensitive)", async () => {
      await db.query(
        "INSERT INTO users (email, password, first_name, last_name, address) VALUES ($1, $2, $3, $4, $5)",
        ["test@user.com", "Password123!", "Test", "User", "123 Test St"]
      );

      const res = await request(server).post("/auth/register").send({
        email: "TESt@usEr.com",
        password: "AnotherPassword123!",
        firstName: "Testy",
        lastName: "User",
        address: "123 Test St, Bristol",
      });

      expect(res.status).toEqual(StatusCodes.CONFLICT);
      expect(res.body).toEqual({
        message: "Email already in use",
        name: "ConflictError",
        status: 409,
      });

      const dbRes = await db.query("SELECT * FROM users");
      expect(dbRes.rows.length).toEqual(1);
    });

    it("should return an error if email is not provided", async () => {
      const res = await request(server).post("/auth/register").send({
        password: "Password123!",
        firstName: "Test",
        lastName: "User",
        address: "123 Test St",
      });

      expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.body).toEqual({
        message: "Email is not valid",
        name: "BadRequestError",
        status: 400,
      });

      const dbRes = await db.query("SELECT * FROM users");
      expect(dbRes.rows.length).toEqual(0);
    });

    it("should return an error if email is not valid", async () => {
      const res = await request(server).post("/auth/register").send({
        email: "testuser.com",
        password: "Password123!",
        firstName: "Test",
        lastName: "User",
        address: "123 Test St",
      });

      expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.body).toEqual({
        message: "Email is not valid",
        name: "BadRequestError",
        status: 400,
      });

      const dbRes = await db.query("SELECT * FROM users");
      expect(dbRes.rows.length).toEqual(0);
    });

    it("should return an error if password is not provided", async () => {
      const res = await request(server).post("/auth/register").send({
        email: "test@user.com",
        firstName: "Test",
        lastName: "User",
        address: "123 Test St",
      });

      expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.body).toEqual({
        message: "Password is required",
        name: "BadRequestError",
        status: 400,
      });

      const dbRes = await db.query("SELECT * FROM users");
      expect(dbRes.rows.length).toEqual(0);
    });

    it("should return an error if password is not strong enough", async () => {
      const res = await request(server).post("/auth/register").send({
        email: "test@user.com",
        password: "password",
        firstName: "Test",
        lastName: "User",
        address: "123 Test St",
      });

      expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.body).toEqual({
        message:
          "Password should have a mix of uppercase and lowercase letters, include at least one numeric digit and one special character",
        name: "BadRequestError",
        status: 400,
      });

      const dbRes = await db.query("SELECT * FROM users");
      expect(dbRes.rows.length).toEqual(0);
    });

    it("should return an error if firstName is not provided", async () => {
      const res = await request(server).post("/auth/register").send({
        email: "test@user.com",
        password: "Password123!",
        lastName: "User",
        address: "123 Test St",
      });

      expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.body).toEqual({
        message: "First name is required",
        name: "BadRequestError",
        status: 400,
      });

      const dbRes = await db.query("SELECT * FROM users");
      expect(dbRes.rows.length).toEqual(0);
    });

    it("should return an error if lastName is not provided", async () => {
      const res = await request(server).post("/auth/register").send({
        email: "test@user.com",
        password: "Password123!",
        firstName: "Test",
        address: "123 Test St",
      });

      expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.body).toEqual({
        message: "Last name is required",
        name: "BadRequestError",
        status: 400,
      });

      const dbRes = await db.query("SELECT * FROM users");
      expect(dbRes.rows.length).toEqual(0);
    });

    it("should return an error if body is empty", async () => {
      const res = await request(server).post("/auth/register").send({});

      expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.body).toEqual({
        message: "Email is not valid",
        name: "BadRequestError",
        status: 400,
      });

      const dbRes = await db.query("SELECT * FROM users");
      expect(dbRes.rows.length).toEqual(0);
    });
  });
});
