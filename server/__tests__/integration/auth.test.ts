/* eslint-disable camelcase */
import request from "supertest";
import { Server } from "http";
import { StatusCodes } from "http-status-codes";

import db from "../../src/db";
import { clearDatabase, createTestServer } from "../utils/testHelpers";
import { userService } from "../../src/services";

let server: Server;

beforeAll(async () => {
  server = await createTestServer();
  console.error = jest.fn();
});

afterAll(async () => {
  await db.end();
  server.close();
});

describe("auth", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(server).post("/auth/register").send({
        email: "new@user.com",
        password: "Password123!",
        firstName: "Test",
        lastName: "User",
        address: "123 Test St",
      });

      expect(res.status).toEqual(StatusCodes.CREATED);
      expect(res.body).toEqual({
        id: expect.any(Number),
        email: "new@user.com",
        firstName: "Test",
        lastName: "User",
        address: "123 Test St",
      });

      const dbRes = await db.query("SELECT * FROM users");
      expect(dbRes.rows.length).toEqual(1);
      expect(dbRes.rows[0]).toEqual({
        id: res.body.id,
        email: "new@user.com",
        password: expect.any(String),
        first_name: "Test",
        last_name: "User",
        address: "123 Test St",
      });

      expect(dbRes.rows[0].password).not.toEqual("Password123!");
      expect(res.body.password).toBeUndefined();
      expect(res.body.id).toEqual(dbRes.rows[0].id);
      expect(res.header["set-cookie"]).toBeDefined();
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

    it("shouldn't allow a logged in user to register", async () => {
      const agent = request.agent(server);

      await agent.post("/auth/register").send({
        email: "demo@user.com",
        password: "Password123!",
        firstName: "Demo",
        lastName: "User",
        address: "123 Test St",
      });

      const res = await agent.post("/auth/register").send({
        email: "try@again.com",
        password: "Password123!",
        firstName: "Try",
        lastName: "Again",
        address: "123 Test St",
      });

      expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.body).toEqual({
        message: "You are already logged in",
        name: "BadRequestError",
        status: 400,
      });
    });
  });

  describe("POST /auth/login", () => {
    beforeEach(async () => {
      await request(server).post("/auth/register").send({
        email: "demo@user.com",
        password: "Password123!",
        firstName: "Demo",
        lastName: "User",
        address: "123 Test St",
      });
    });

    it("should login a user", async () => {
      const res = await request(server).post("/auth/login").send({
        email: "demo@user.com",
        password: "Password123!",
      });

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
        })
      );

      expect(res.header["set-cookie"]).toBeDefined();
    });

    function expectLogInFail(res: request.Response) {
      expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.body).toEqual({
        message: "Incorrect email or password",
        name: "BadRequestError",
        status: StatusCodes.BAD_REQUEST,
      });

      expect(res.header["set-cookie"]).toBeUndefined();
    }

    it("should return an error if email is incorrect", async () => {
      const res = await request(server).post("/auth/login").send({
        email: "demooe@user.com",
        password: "Password123!",
      });

      expectLogInFail(res);
    });

    it("should return an error if password is incorrect", async () => {
      const res = await request(server).post("/auth/login").send({
        email: "demo@user.com",
        password: "Password123",
      });

      expectLogInFail(res);
    });

    it("should return an error if email is not provided", async () => {
      const res = await request(server).post("/auth/login").send({
        password: "Password123!",
      });

      expectLogInFail(res);
    });

    it("should return an error if password is not provided", async () => {
      const res = await request(server).post("/auth/login").send({
        email: "demo@user.com",
      });

      expectLogInFail(res);
    });

    it("should return an error if body is empty", async () => {
      const res = await request(server).post("/auth/login").send({});

      expectLogInFail(res);
    });

    it("should return an error if user is already logged in", async () => {
      const agent = request.agent(server);

      await agent.post("/auth/login").send({
        email: "demo@user.com",
        password: "Password123!",
      });

      const res = await agent.post("/auth/login").send({
        email: "demo.user.com",
        password: "Password123!",
      });

      expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.body).toEqual({
        message: "You are already logged in",
        name: "BadRequestError",
        status: StatusCodes.BAD_REQUEST,
      });
    });

    it("should recognise email as case insensitive", async () => {
      await request(server).post("/auth/register").send({
        email: "neEdCasEinsensitive@test.com",
        password: "Password123!",
        firstName: "Demo",
        lastName: "User",
        address: "123 Test St",
      });

      const res = await request(server).post("/auth/login").send({
        email: "Needcaseinsensitive@test.com",
        password: "Password123!",
      });

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
        })
      );

      expect(res.header["set-cookie"]).toBeDefined();
    });

    it("should return an error if an error occurs during Passport authentication", async () => {
      jest.spyOn(userService, "getByEmail").mockImplementationOnce(() => {
        throw new Error("Something went wrong");
      });

      const res = await request(server).post("/auth/login").send({
        email: "fake@user.com",
        password: "Fake123!",
      });

      expect(res.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toEqual({
        message: "Something went wrong",
        name: "InternalServerError",
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });

      expect(res.header["set-cookie"]).toBeUndefined();
    });
  });

  describe("POST /auth/logout", () => {
    it("should logout a user", async () => {
      const agent = request.agent(server);

      await agent.post("/auth/register").send({
        email: "demo@user.com",
        password: "Password123!",
        firstName: "Demo",
        lastName: "User",
        address: "123 Test St",
      });

      await agent.post("/auth/login").send({
        email: "demo@user.com",
        password: "Password123!",
      });

      const res = await agent.post("/auth/logout");

      expect(res.status).toEqual(StatusCodes.NO_CONTENT);

      expect(res.header["set-cookie"]).toBeUndefined();
    });

    it("should return an error if user is not logged in", async () => {
      const res = await request(server).post("/auth/logout");

      expect(res.status).toEqual(StatusCodes.UNAUTHORIZED);
      expect(res.body).toEqual({
        message: "You must be logged in to do that",
        name: "UnauthorizedError",
        status: StatusCodes.UNAUTHORIZED,
      });
    });
  });
});
