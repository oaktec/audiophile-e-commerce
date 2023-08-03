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
import { cartService } from "../../src/services";

let server: Server;
let agent: request.SuperAgentTest;
let secondAgent: request.SuperAgentTest;
let agentId: number;
let secondAgentId: number;
let productId: number;

beforeAll(async () => {
  server = await createTestServer();

  console.error = jest.fn();

  await clearAndPopDB();

  agent = request.agent(server);
  secondAgent = request.agent(server);
  let res = await registerAndLoginAgent(server, agent);
  agentId = res.body.id;
  res = await registerAndLoginAgent(server, secondAgent, true);
  secondAgentId = res.body.id;

  productId = (await db.query("SELECT id FROM products LIMIT 1")).rows[0].id;
});

afterAll(async () => {
  await db.end();
  server.close();
});

describe("cart", () => {
  describe("POST /cart/:userId", () => {
    beforeEach(async () => {
      await deleteAllCarts();
    });
    it("should create a cart for a logged in user", async () => {
      const response = await agent.post(`/cart/${agentId}`);

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
      const response = await request(server).post(`/cart/${agentId}`);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);

      const cartRows = await db.query("SELECT * FROM carts");

      expect(cartRows.rows).toHaveLength(0);
    });

    it("should return 403 if user is not the same as logged in user", async () => {
      const response = await secondAgent.post(`/cart/${agentId}`);

      expect(response.status).toBe(StatusCodes.FORBIDDEN);

      const cartRows = await db.query("SELECT * FROM carts");

      expect(cartRows.rows).toHaveLength(0);
    });

    it("should return 400 if user already has an active cart", async () => {
      await agent.post(`/cart/${agentId}`);

      const response = await agent.post(`/cart/${agentId}`);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);

      const cartRows = await db.query("SELECT * FROM carts");
      expect(cartRows.rows).toHaveLength(1);
    });

    it("should create a cart for a logged in user if they have an inactive cart", async () => {
      await agent.post(`/cart/${agentId}`);
      await db.query("UPDATE carts SET active = false");
      const initialCartId = (
        await db.query("SELECT * FROM carts WHERE active = false")
      ).rows[0].id;

      const response = await agent.post(`/cart/${agentId}`);

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

      const response = await agent.post(`/cart/${agentId}`);

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);

      const cartRows = await db.query("SELECT * FROM carts");
      expect(cartRows.rows).toHaveLength(0);
    });
  });

  describe("GET /cart/:userId", () => {
    beforeEach(async () => {
      await deleteAllCarts();
    });

    it("should return the active cart for a logged in user", async () => {
      await agent.post(`/cart/${agentId}`);

      const response = await agent.get(`/cart/${agentId}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual({
        id: expect.any(Number),
        userId: agentId,
        active: true,
      });
    });

    it("should return 403 if user is not the owner of the cart", async () => {
      await agent.post(`/cart/${agentId}`);

      await secondAgent.post(`/cart/${secondAgentId}`);

      const response = await agent.get(`/cart/${secondAgentId}`);

      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });

    it("should return 401 if user is not logged in", async () => {
      const response = await request(server).get(`/cart/${agentId}`);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it("should return 404 if user does not have an active cart", async () => {
      const response = await agent.get(`/cart/${agentId}`);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it("should return 500 if getting the cart fails", async () => {
      jest.spyOn(db, "query").mockImplementationOnce(() => {
        return Promise.reject(new Error("Test Error"));
      });

      const response = await agent.get(`/cart/${agentId}`);

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe("DELETE /cart/:userId", () => {
    beforeEach(async () => {
      await deleteAllCarts();
    });

    it("should delete the active cart for a logged in user", async () => {
      await agent.post(`/cart/${agentId}`);

      const response = await agent.delete(`/cart/${agentId}`);

      expect(response.status).toBe(StatusCodes.NO_CONTENT);

      const cartRows = await db.query("SELECT * FROM carts");
      expect(cartRows.rows).toHaveLength(0);
    });

    it("should return 401 if user is not logged in", async () => {
      const response = await request(server).delete(`/cart/${agentId}`);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it("should return 403 if user is not the owner of the cart", async () => {
      await agent.post(`/cart/${agentId}`);

      await secondAgent.post(`/cart/${secondAgentId}`);

      const response = await agent.delete(`/cart/${secondAgentId}`);

      expect(response.status).toBe(StatusCodes.FORBIDDEN);

      const cartRows = await db.query("SELECT * FROM carts");

      expect(cartRows.rows).toHaveLength(2);
    });

    it("should return 404 if user does not have an active cart", async () => {
      const response = await agent.delete(`/cart/${agentId}`);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it("should return 500 if deleting the cart fails", async () => {
      await agent.post(`/cart/${agentId}`);

      jest.spyOn(cartService, "delete").mockImplementationOnce(() => {
        return Promise.reject(new Error("Test Error"));
      });

      await agent.post(`/cart/${agentId}`);

      const response = await agent.delete(`/cart/${agentId}`);

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe("POST /cart/:userId/add/:productId", () => {
    beforeEach(async () => {
      await deleteAllCarts();
    });

    it("should add a product to the cart", async () => {
      await agent.post(`/cart/${agentId}`);

      const response = await agent
        .post(`/cart/${agentId}/add/${productId}`)
        .send({
          quantity: 3,
        });

      expect(response.status).toBe(StatusCodes.OK);

      const cartRows = await db.query("SELECT * FROM carts");
      expect(cartRows.rows).toHaveLength(1);

      const cartItemsRows = await db.query("SELECT * FROM cart_items");
      expect(cartItemsRows.rows).toHaveLength(1);
      expect(cartItemsRows.rows[0]).toEqual({
        cart_id: cartRows.rows[0].id,
        product_id: productId,
        quantity: 3,
      });
    });

    it("should return 401 if user is not logged in", async () => {
      const response = await request(server)
        .post(`/cart/${agentId}/add/${productId}`)
        .send({
          quantity: 1,
        });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it("should return 404 if cart does not exist", async () => {
      const response = await agent
        .post(`/cart/${agentId}/add/${productId}`)
        .send({
          quantity: 1,
        });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it("should return 400 if product does not exist", async () => {
      await agent.post(`/cart/${agentId}`);

      const response = await agent.post(`/cart/${agentId}/add/42342341`).send({
        quantity: 1,
      });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Product not found",
        })
      );
    });

    it("should return 400 if body if empty", async () => {
      await agent.post(`/cart/${agentId}`);

      const response = await agent.post(`/cart/${agentId}/add/${productId}`);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Quantity is required",
        })
      );
    });

    it("should return 400 if quantity is not a number", async () => {
      await agent.post(`/cart/${agentId}`);

      const response = await agent
        .post(`/cart/${agentId}/add/${productId}`)
        .send({
          quantity: "not a number",
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Quantity should be greater than 0 and less than 100",
        })
      );
    });

    it("should return 400 if quantity is less than 1", async () => {
      await agent.post(`/cart/${agentId}`);

      const response = await agent
        .post(`/cart/${agentId}/add/${productId}`)
        .send({
          quantity: 0,
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Quantity should be greater than 0 and less than 100",
        })
      );
    });
  });
});
