/* eslint-disable camelcase */
import request from "supertest";
import { Server } from "http";
import { StatusCodes } from "http-status-codes";

import db from "../../src/db";
import {
  clearAndPopDB,
  createTestServer,
  deleteAllCarts,
  registerAndLoginAgent,
} from "../utils/testHelpers";

let server: Server;
let agent: request.SuperAgentTest;
let agentId: number;

beforeAll(async () => {
  server = await createTestServer();

  console.error = jest.fn();

  await clearAndPopDB();

  agent = request.agent(server);
  const res = await registerAndLoginAgent(server, agent);
  agentId = res.body.id;
});

afterAll(async () => {
  await db.end();
  server.close();
});

describe("cart", () => {
  describe("POST /cart", () => {
    beforeEach(async () => {
      await deleteAllCarts();
    });
    it("should create a cart for a logged in user", async () => {
      const response = await agent.post("/cart");

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toEqual({
        id: expect.any(Number),
      });

      const cartRows = await db.query("SELECT * FROM carts");
      expect(cartRows.rows).toHaveLength(1);
      expect(cartRows.rows[0]).toEqual({
        id: response.body.id,
        user_id: agentId,
        active: true,
      });
    });

    it("should return 401 if user is not logged in", async () => {
      const response = await request(server).post("/cart");

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);

      const cartRows = await db.query("SELECT * FROM carts");

      expect(cartRows.rows).toHaveLength(0);
    });

    it("should return 400 if user already has an active cart", async () => {
      await agent.post("/cart");

      const response = await agent.post("/cart");

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);

      const cartRows = await db.query("SELECT * FROM carts");
      expect(cartRows.rows).toHaveLength(1);
    });

    it("should create a cart for a logged in user if they have an inactive cart", async () => {
      await agent.post("/cart");
      await db.query("UPDATE carts SET active = false");
      const initialCartId = (
        await db.query("SELECT * FROM carts WHERE active = false")
      ).rows[0].id;

      const response = await agent.post("/cart");

      expect(response.status).toBe(StatusCodes.CREATED);

      const cartRows = await db.query(
        "SELECT * FROM carts WHERE active = true"
      );
      expect(cartRows.rows).toHaveLength(1);
      expect(initialCartId).not.toEqual(cartRows.rows[0].id);
    });

    it("should return 500 if creating a cart fails", async () => {
      jest.spyOn(db, "query").mockImplementationOnce(() => {
        return Promise.reject(new Error("Test Error"));
      });

      const response = await agent.post("/cart");

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);

      const cartRows = await db.query("SELECT * FROM carts");
      expect(cartRows.rows).toHaveLength(0);
    });
  });
});
