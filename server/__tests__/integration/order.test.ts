import request from "supertest";
import { Server } from "http";
import { StatusCodes } from "http-status-codes";

import db from "../../src/db";
import {
  clearAndPopDB,
  createTestServer,
  giveAgentSomeOrders,
  registerAndLoginAgent,
} from "../utils/testHelpers";
import { IOrderItem } from "../../src/services/orderService";

let server: Server;
let agent: request.SuperAgentTest;
let secondAgent: request.SuperAgentTest;
let agentId: number;
let orderId: number;

beforeAll(async () => {
  server = await createTestServer();

  console.error = jest.fn();
  await clearAndPopDB();

  agent = request.agent(server);
  const res = await registerAndLoginAgent(agent);
  agentId = res.body.id;
  await giveAgentSomeOrders(agent);

  secondAgent = request.agent(server);
  await registerAndLoginAgent(secondAgent, true);

  const { rows } = await db.query("SELECT id FROM orders WHERE user_id = $1", [
    agentId,
  ]);
  orderId = rows[0].id;
});

afterAll(async () => {
  await db.end();
  server.close();
});

describe("orders", () => {
  describe("GET /orders", () => {
    it("should return all orders for the logged in user", async () => {
      const res = await agent.get("/orders");

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toHaveLength(2);

      const firstOrder = res.body[0];

      const firstOrderId = firstOrder.id;

      let items = firstOrder.items;
      let expectedTotal = items.reduce(
        (total: number, item: IOrderItem) =>
          total + item.product.price * item.quantity,
        0
      );
      expect(firstOrder.userId).toBe(agentId);
      expect(firstOrder.total).toBe(expectedTotal);
      expect(firstOrder.items).toHaveLength(2);
      expect(firstOrder.items[0].product.name).toBe("Test Item 1");

      const secondOrder = res.body[1];
      items = secondOrder.items;
      expectedTotal = items.reduce(
        (total: number, item: IOrderItem) =>
          total + item.product.price * item.quantity,
        0
      );
      expect(secondOrder.id).toBe(firstOrderId + 1);
      expect(secondOrder.userId).toBe(agentId);
      expect(secondOrder.total).toBe(expectedTotal);
      expect(secondOrder.items).toHaveLength(2);
      expect(secondOrder.items[0].product.name).toBe("Test Item 1");
    });

    it("should return an empty array if the user has no orders", async () => {
      const res = await secondAgent.get("/orders");

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toHaveLength(0);
    });

    it("should return 401 if the user is not logged in", async () => {
      const res = await request(server).get("/orders");

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it("should return 500 if there is a database error", async () => {
      const querySpy = jest.spyOn(db, "query");
      querySpy.mockImplementationOnce(() => {
        throw new Error("Test error");
      });

      const res = await agent.get("/orders");

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("message", "Test error");
    });
  });

  describe("GET /orders/:id", () => {
    it("should return the order with the given id", async () => {
      const res = await agent.get(`/orders/${orderId}`);

      const expectedTotal = res.body.items.reduce(
        (total: number, item: IOrderItem) =>
          total + item.product.price * item.quantity,
        0
      );

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.id).toBe(orderId);
      expect(res.body.userId).toBe(agentId);
      expect(res.body.total).toBe(expectedTotal);
      expect(res.body.items).toHaveLength(2);
      expect(res.body.items[0].product.name).toBe("Test Item 1");
    });

    it("should return 404 if the order does not exist", async () => {
      const res = await agent.get("/orders/98468546");

      expect(res.status).toBe(StatusCodes.NOT_FOUND);
    });

    it("should return 400 if the id is not a number", async () => {
      const res = await agent.get("/orders/abc");

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should return 401 if the user is not logged in", async () => {
      const res = await request(server).get("/orders/1");

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it("should return 403 if the user is not the owner of the order", async () => {
      const res = await secondAgent.get(`/orders/${orderId}`);

      expect(res.status).toBe(StatusCodes.FORBIDDEN);
    });

    it("should return 500 if there is a database error", async () => {
      const querySpy = jest.spyOn(db, "query");
      querySpy.mockImplementation(() => {
        throw new Error("Test error");
      });

      const res = await agent.get("/orders/1");

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("message", "Test error");
    });
  });
});
