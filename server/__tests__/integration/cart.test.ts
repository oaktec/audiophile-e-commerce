/* eslint-disable camelcase */
import request from "supertest";
import { Server } from "http";
import { StatusCodes } from "http-status-codes";

import db from "../../src/db";
import {
  clearAndPopDB,
  createTestServer,
  deleteAllCarts,
  giveAgentACartWithProducts,
  registerAndLoginAgent,
} from "../utils/testHelpers";
import { cartService } from "../../src/services";

let server: Server;
let agent: request.SuperAgentTest;
let secondAgent: request.SuperAgentTest;
let agentId: number;
let productId: number;

beforeAll(async () => {
  server = await createTestServer();

  console.error = jest.fn();

  await clearAndPopDB();

  agent = request.agent(server);
  secondAgent = request.agent(server);
  let res = await registerAndLoginAgent(agent);
  agentId = res.body.id;
  res = await registerAndLoginAgent(secondAgent, true);

  productId = (await db.query("SELECT id FROM products LIMIT 1")).rows[0].id;
});

afterAll(async () => {
  await db.end();
  server.close();
});

describe("cart", () => {
  describe("GET /cart", () => {
    beforeEach(async () => {
      await deleteAllCarts();
    });

    it("should return the active cart for a logged in user", async () => {
      await agent.post(`/cart`);

      const response = await agent.get(`/cart`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual({
        id: expect.any(Number),
        userId: agentId,
        active: true,
        items: [],
      });
    });

    it("should return the active cart with products for a logged in user", async () => {
      await giveAgentACartWithProducts(agent);

      const response = await agent.get(`/cart`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual({
        id: expect.any(Number),
        userId: agentId,
        active: true,
        items: expect.arrayContaining([
          expect.objectContaining({
            slug: expect.any(String),
            name: expect.any(String),
            price: expect.any(Number),
            quantity: 1,
          }),
          expect.objectContaining({
            slug: expect.any(String),
            quantity: 2,
          }),
        ]),
      });
    });

    it("should return 401 if user is not logged in", async () => {
      const response = await request(server).get(`/cart`);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it("should create a cart if user does not have an active cart", async () => {
      const response = await agent.get(`/cart`);

      expect(response.status).toBe(StatusCodes.OK);

      const cartRows = await db.query("SELECT * FROM carts");
      expect(cartRows.rows).toHaveLength(1);
      expect(cartRows.rows[0]).toEqual({
        id: response.body.id,
        user_id: agentId,
        active: true,
      });
    });

    it("should return 500 if getting the cart fails", async () => {
      jest.spyOn(db, "query").mockImplementationOnce(() => {
        return Promise.reject(new Error("Test Error"));
      });

      const response = await agent.get(`/cart`);

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe("DELETE /cart", () => {
    beforeEach(async () => {
      await deleteAllCarts();
    });

    it("should delete the active cart for a logged in user", async () => {
      await agent.post(`/cart`);

      const response = await agent.delete(`/cart`);

      expect(response.status).toBe(StatusCodes.NO_CONTENT);

      const cartRows = await db.query("SELECT * FROM carts");
      expect(cartRows.rows).toHaveLength(0);
    });

    it("should return 401 if user is not logged in", async () => {
      const response = await request(server).delete(`/cart`);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it("should return 500 if deleting the cart fails", async () => {
      await agent.post(`/cart`);

      jest.spyOn(cartService, "delete").mockImplementationOnce(() => {
        return Promise.reject(new Error("Test Error"));
      });

      await agent.post(`/cart`);

      const response = await agent.delete(`/cart`);

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe("POST /cart/add/:productId", () => {
    beforeEach(async () => {
      await deleteAllCarts();
    });

    it("should add a product to the cart", async () => {
      await agent.post(`/cart`);

      const response = await agent.post(`/cart/add/${productId}`).send({
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
        .post(`/cart/add/${productId}`)
        .send({
          quantity: 1,
        });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it("should return 404 if product does not exist", async () => {
      await agent.post(`/cart`);

      const response = await agent.post(`/cart/add/42342341`).send({
        quantity: 1,
      });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Product not found",
        })
      );
    });

    it("should return 400 if body if empty", async () => {
      await agent.post(`/cart`);

      const response = await agent.post(`/cart/add/${productId}`);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Quantity is required",
        })
      );
    });

    it("should return 400 if quantity is not a number", async () => {
      await agent.post(`/cart`);

      const response = await agent.post(`/cart/add/${productId}`).send({
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
      await agent.post(`/cart`);

      const response = await agent.post(`/cart/add/${productId}`).send({
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

  describe("DELETE /cart/remove/:productId", () => {
    let productIds: number[];

    beforeEach(async () => {
      await deleteAllCarts();
      const cartRes = await giveAgentACartWithProducts(agent);
      const cartId = cartRes.body.id;

      const cartItemsRows = await db.query(
        "SELECT * FROM cart_items WHERE cart_id = $1",
        [cartId]
      );

      productIds = cartItemsRows.rows.map((row) => row.product_id);
    });

    it("should remove a product from the cart", async () => {
      let cartRows = await db.query("SELECT * FROM carts");
      expect(cartRows.rows).toHaveLength(1);

      let cartItemsRows = await db.query("SELECT * FROM cart_items");
      expect(cartItemsRows.rows).toHaveLength(2);

      const response = await agent.delete(`/cart/remove/${productIds[0]}`);

      expect(response.status).toBe(StatusCodes.OK);

      expect(response.body).toEqual(
        expect.objectContaining({
          active: true,
          items: expect.arrayContaining([
            expect.objectContaining({
              slug: expect.any(String),
              name: expect.any(String),
              price: expect.any(Number),
              quantity: 2,
            }),
          ]),
        })
      );

      cartRows = await db.query("SELECT * FROM carts");
      expect(cartRows.rows).toHaveLength(1);

      cartItemsRows = await db.query("SELECT * FROM cart_items");
      expect(cartItemsRows.rows).toHaveLength(1);
    });

    it("should return 401 if user is not logged in", async () => {
      const response = await request(server).delete(
        `/cart/remove/${productIds[0]}`
      );

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it("should return 404 if cart does not exist", async () => {
      const response = await secondAgent.delete(
        `/cart/remove/${productIds[0]}`
      );

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it("should return 400 if product does not exist", async () => {
      const response = await agent.delete(`/cart/remove/42342341`);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Product not found",
        })
      );
    });

    it("should return 404 if product is not in the cart", async () => {
      const delResponse = await agent.delete(`/cart/remove/${productIds[0]}`);

      expect(delResponse.status).toBe(StatusCodes.OK);

      const response = await agent.delete(`/cart/remove/${productIds[0]}`);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Product not found in cart",
        })
      );
    });

    it("should return 400 if product id is not a number", async () => {
      const response = await agent.delete(`/cart/remove/not-a-number`);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Product ID is required",
        })
      );
    });
  });

  describe("PATCH /cart/update/:productId", () => {
    let productIds: number[];

    beforeEach(async () => {
      await deleteAllCarts();
      const cartRes = await giveAgentACartWithProducts(agent);
      const cartId = cartRes.body.id;

      const cartItemsRows = await db.query(
        "SELECT * FROM cart_items WHERE cart_id = $1",
        [cartId]
      );

      productIds = cartItemsRows.rows.map((row) => row.product_id);
    });

    it("should update the quantity of a product in the cart and return it", async () => {
      const response = await agent.patch(`/cart/update/${productId}`).send({
        quantity: 5,
      });

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          active: true,
          items: expect.arrayContaining([
            expect.objectContaining({
              slug: expect.any(String),
              name: expect.any(String),
              price: expect.any(Number),
              quantity: 5,
            }),
          ]),
        })
      );

      const cartItemsRows = await db.query(
        "SELECT * FROM cart_items WHERE product_id = $1",
        [productId]
      );

      expect(cartItemsRows.rows[0].quantity).toBe(5);
    });

    it("should return 401 if user is not logged in", async () => {
      const response = await request(server)
        .patch(`/cart/update/${productIds[0]}`)
        .send({
          quantity: 5,
        });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it("should return 404 if cart does not exist", async () => {
      const response = await secondAgent
        .patch(`/cart/update/${productIds[0]}`)
        .send({
          quantity: 5,
        });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it("should return 400 if product does not exist", async () => {
      const response = await agent.patch(`/cart/update/42342341`).send({
        quantity: 5,
      });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Product not found",
        })
      );
    });

    it("should return 404 if product is not in the cart", async () => {
      const delResponse = await agent.delete(`/cart/remove/${productIds[0]}`);

      expect(delResponse.status).toBe(StatusCodes.OK);

      const response = await agent.patch(`/cart/update/${productIds[0]}`).send({
        quantity: 5,
      });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Product not found in cart",
        })
      );
    });

    it("should return 400 if product id is not a number", async () => {
      const response = await agent.patch(`/cart/update/not-a-number`).send({
        quantity: 5,
      });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Product ID is required",
        })
      );
    });

    it("should return 400 if quantity is not a number", async () => {
      const response = await agent.patch(`/cart/update/${productIds[0]}`).send({
        quantity: "not-a-number",
      });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Quantity should be greater than 0 and less than 100",
        })
      );
    });

    it("should return 400 if body is empty", async () => {
      const response = await agent.patch(`/cart/update/${productIds[0]}`);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Quantity is required",
        })
      );
    });
  });

  describe("POST /cart/checkout", () => {
    let cartId: number;

    beforeEach(async () => {
      await deleteAllCarts();
      const cartRes = await giveAgentACartWithProducts(agent);
      cartId = cartRes.body.id;
    });

    it("should checkout the cart", async () => {
      const response = await agent.post(`/cart/checkout`).send({
        address: "123 Fake Street",
        city: "Fake City",
        postcode: "FAKE123",
        paymentMethod: "e-Money",
        paymentParams: {},
      });

      expect(response.status).toBe(StatusCodes.NO_CONTENT);

      const cartRows = await db.query("SELECT * FROM carts WHERE id = $1", [
        cartId,
      ]);

      expect(cartRows.rows).toHaveLength(1);
      expect(cartRows.rows[0].active).toBe(false);

      const orderRows = await db.query(
        "SELECT * FROM orders WHERE cart_id = $1",
        [cartId]
      );

      expect(orderRows.rows).toHaveLength(1);
      expect(orderRows.rows[0].cart_id).toBe(cartId);
      expect(orderRows.rows[0].user_id).toBe(agentId);
    });

    it("should return 401 if user is not logged in", async () => {
      const response = await request(server).post(`/cart/checkout`);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it("should return 404 if cart does not exist", async () => {
      const response = await secondAgent.post(`/cart/checkout`).send({
        address: "123 Fake Street",
        city: "Fake City",
        postcode: "FAKE123",
        paymentMethod: "e-Money",
        paymentParams: {},
      });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Cart is empty",
        })
      );
    });

    it("should return 400 if cart is already checked out", async () => {
      await agent.post(`/cart/checkout`).send({
        address: "123 Fake Street",
        city: "Fake City",
        postcode: "FAKE123",
        paymentMethod: "e-Money",
        paymentParams: {},
      });

      const response = await agent.post(`/cart/checkout`).send({
        address: "123 Fake Street",
        city: "Fake City",
        postcode: "FAKE123",
        paymentMethod: "e-Money",
        paymentParams: {},
      });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Cart is empty",
        })
      );
    });

    it("should return 400 if cart is empty", async () => {
      await secondAgent.post(`/cart`);

      const response = await secondAgent.post(`/cart/checkout`).send({
        address: "123 Fake Street",
        city: "Fake City",
        postcode: "FAKE123",
        paymentMethod: "e-Money",
        paymentParams: {},
      });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Cart is empty",
        })
      );
    });
  });
});
