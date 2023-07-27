import request from "supertest";
import { Server } from "http";
import { StatusCodes } from "http-status-codes";

import db from "../../src/db";
import { createTestServer } from "../utils/testHelpers";

let server: Server;

beforeAll(async () => {
  server = await createTestServer();
  console.error = jest.fn();
});

afterAll(async () => {
  await db.end();
  server.close();
});

describe("server", () => {
  describe("GET /health", () => {
    it("should return 200", async () => {
      const response = await request(server).get("/health");

      expect(response.status).toBe(StatusCodes.OK);
    });
  });

  describe("GET /non-existent-route", () => {
    it("should return 404", async () => {
      const response = await request(server).get("/non-existent-route");

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
