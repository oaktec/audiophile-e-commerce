/* eslint-disable camelcase */
import request from "supertest";
import { Server } from "http";
import { StatusCodes } from "http-status-codes";

import db from "../../src/db";
import {
  clearAndPopDB,
  createTestServer,
  registerAndLoginAgent,
} from "../utils/testHelpers";

let server: Server;

describe("users", () => {
  let userId: number;
  let agent: request.SuperAgentTest;

  beforeAll(async () => {
    server = await createTestServer();
    agent = request.agent(server);

    console.error = jest.fn();

    await clearAndPopDB();

    const res = await registerAndLoginAgent(server, agent);
    userId = res.body.id;
  });

  afterAll(async () => {
    await db.end();
    server.close();
  });

  describe("GET /users/:id", () => {
    it("returns a user by id", async () => {
      const response = await agent.get(`/users/${userId}`);

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({
        id: userId,
        email: "lola@granola.com",
        firstName: "Lola",
        lastName: "Granola",
        address: "123 Lola St",
      });
    });

    it("cannot access another user", async () => {
      const { rows } = await db.query(
        "SELECT id FROM users WHERE email != 'lola@granola.com' LIMIT 1"
      );
      const firstId = rows[0].id;
      const response = await agent.get(`/users/${firstId}`);

      expect(response.status).toEqual(StatusCodes.FORBIDDEN);
      expect(response.body).toEqual({
        message: "You do not have permission to do that",
        name: "ForbiddenError",
        status: 403,
      });
    });

    it("cannot access a user if not logged in", async () => {
      const response = await request(server).get(`/users/${userId}`);

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED);
      expect(response.body).toEqual({
        message: "You must be logged in to do that",
        name: "UnauthorizedError",
        status: 401,
      });
    });

    it("returns a 400 if the id is not a number", async () => {
      const response = await agent.get("/users/abc");

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        message: "Invalid user id",
        name: "BadRequestError",
        status: 400,
      });
    });

    it("returns a 400 if the id is negative", async () => {
      const response = await agent.get("/users/-1");

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        message: "Invalid user id",
        name: "BadRequestError",
        status: 400,
      });
    });
  });

  describe("PUT /users/:id", () => {
    beforeEach(async () => {
      await clearAndPopDB();

      const res = await registerAndLoginAgent(server, agent);
      userId = res.body.id;
    });

    it("updates a user by id", async () => {
      const response = await agent.put(`/users/${userId}`).send({
        email: "new@email.com",
        firstName: "New",
        lastName: "Name",
        address: "123 New St",
      });

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({
        id: userId,
        email: "new@email.com",
        firstName: "New",
        lastName: "Name",
        address: "123 New St",
      });

      const updatedUser = await db.query("SELECT * FROM users WHERE id = $1", [
        userId,
      ]);

      expect(updatedUser.rows[0]).toEqual({
        id: userId,
        password: expect.any(String),
        email: "new@email.com",
        first_name: "New",
        last_name: "Name",
        address: "123 New St",
      });
    });

    it("cannot update another user", async () => {
      const { rows } = await db.query(
        "SELECT id FROM users WHERE email != 'lola@granola.com' LIMIT 1"
      );

      const firstId = rows[0].id;

      const response = await agent.put(`/users/${firstId}`).send({
        firstName: "New",
        lastName: "Name",
      });

      expect(response.status).toEqual(StatusCodes.FORBIDDEN);
      expect(response.body).toEqual({
        message: "You do not have permission to do that",
        name: "ForbiddenError",
        status: 403,
      });
    });

    it("cannot update a user if not logged in", async () => {
      const response = await request(server).put(`/users/${userId}`).send({
        firstName: "New",
        lastName: "Name",
      });

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED);
      expect(response.body).toEqual({
        message: "You must be logged in to do that",
        name: "UnauthorizedError",
        status: 401,
      });
    });

    it("updates a user when only some fields are provided", async () => {
      const response = await agent.put(`/users/${userId}`).send({
        firstName: "New",
        lastName: "Name",
      });

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({
        id: userId,
        email: "lola@granola.com",
        firstName: "New",
        lastName: "Name",
        address: "123 Lola St",
      });

      const updatedUser = await db.query("SELECT * FROM users WHERE id = $1", [
        userId,
      ]);

      expect(updatedUser.rows[0]).toEqual({
        id: userId,
        password: expect.any(String),
        email: "lola@granola.com",
        first_name: "New",
        last_name: "Name",
        address: "123 Lola St",
      });
    });

    it("doesn't store raw password", async () => {
      const response = await agent.put(`/users/${userId}`).send({
        password: "NewPassw0rd!",
        email: "changed@password.com",
      });

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({
        id: userId,
        email: "changed@password.com",
        firstName: "Lola",
        lastName: "Granola",
        address: "123 Lola St",
      });

      const updatedUser = await db.query("SELECT * FROM users WHERE id = $1", [
        userId,
      ]);

      expect(updatedUser.rows[0]).toEqual({
        id: userId,
        password: expect.any(String),
        email: "changed@password.com",
        first_name: "Lola",
        last_name: "Granola",
        address: "123 Lola St",
      });

      expect(updatedUser.rows[0].password).not.toEqual("newpassword");
      expect(updatedUser.rows[0].password).not.toEqual("lol4TheB3st1!");
    });

    it("returns a 400 if the id is not a number", async () => {
      const response = await agent.put("/users/abc").send({
        firstName: "New",
        lastName: "Name",
      });

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        message: "Invalid user id",
        name: "BadRequestError",
        status: 400,
      });
    });

    it("returns a 400 if the id is negative", async () => {
      const response = await agent.put("/users/-1").send({
        firstName: "New",
        lastName: "Name",
      });

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        message: "Invalid user id",
        name: "BadRequestError",
        status: 400,
      });
    });

    it("returns a 400 if the email is invalid", async () => {
      const response = await agent.put(`/users/${userId}`).send({
        email: "invalid",
        firstName: "New",
        lastName: "Name",
      });

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        message: "Invalid email",
        name: "BadRequestError",
        status: 400,
      });
    });

    it("returns a 400 if the email is already taken", async () => {
      const response = await agent.put(`/users/${userId}`).send({
        email: "demo@user.com",
        firstName: "New",
        lastName: "Name",
      });

      expect(response.status).toEqual(StatusCodes.CONFLICT);
      expect(response.body).toEqual({
        message: "Email already in use",
        name: "ConflictError",
        status: 409,
      });
    });

    it("returns a 400 if the first name is invalid", async () => {
      const response = await agent.put(`/users/${userId}`).send({
        firstName: "",
        lastName: "Name",
      });

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        message: "First name should be between 2 and 50 characters",
        name: "BadRequestError",
        status: 400,
      });
    });

    it("returns a 400 if the last name is invalid", async () => {
      const response = await agent.put(`/users/${userId}`).send({
        firstName: "New",
        lastName: "",
      });

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        message: "Last name should be between 2 and 50 characters",
        name: "BadRequestError",
        status: 400,
      });
    });

    it("returns a 400 if the address is invalid", async () => {
      const response = await agent.put(`/users/${userId}`).send({
        firstName: "New",
        lastName: "Name",
        address: "",
      });

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        message: "Address should be between 5 and 100 characters",
        name: "BadRequestError",
        status: 400,
      });
    });

    it("returns a 400 if the password is invalid", async () => {
      const response = await agent.put(`/users/${userId}`).send({
        firstName: "New",
        lastName: "Name",
        password: "short",
      });

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        message: "Password should be between 8 and 100 characters",
        name: "BadRequestError",
        status: 400,
      });
    });
  });

  describe("DELETE /users/:id", () => {
    beforeEach(async () => {
      await clearAndPopDB();

      const res = await registerAndLoginAgent(server, agent);
      userId = res.body.id;
    });

    it("deletes a user", async () => {
      const response = await agent.delete(`/users/${userId}`);

      expect(response.status).toEqual(StatusCodes.NO_CONTENT);
      expect(response.body).toEqual({});

      const user = await db.query("SELECT * FROM users WHERE id = $1", [
        userId,
      ]);

      expect(user.rows.length).toEqual(0);
    });

    it("cannot delete another user", async () => {
      const { rows } = await db.query(
        "SELECT id FROM users WHERE email != 'lola@granola.com' LIMIT 1"
      );
      const firstId = rows[0].id;

      const response = await agent.delete(`/users/${firstId}`);

      expect(response.status).toEqual(StatusCodes.FORBIDDEN);
      expect(response.body).toEqual({
        message: "You do not have permission to do that",
        name: "ForbiddenError",
        status: 403,
      });
    });

    it("cannot delete a user if not logged in", async () => {
      const response = await request(server).delete(`/users/${userId}`);

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED);
      expect(response.body).toEqual({
        message: "You must be logged in to do that",
        name: "UnauthorizedError",
        status: 401,
      });
    });

    it("returns a 400 if the id is not a number", async () => {
      const response = await agent.delete("/users/abc");

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        message: "Invalid user id",
        name: "BadRequestError",
        status: 400,
      });
    });

    it("returns a 400 if the id is negative", async () => {
      const response = await agent.delete("/users/-1");

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        message: "Invalid user id",
        name: "BadRequestError",
        status: 400,
      });
    });
  });
});
