import request from "supertest";
import { Server } from "http";
import { StatusCodes } from "http-status-codes";

import db from "../../src/db";
import { clearAndPopDB, createTestServer } from "../utils/testHelpers";

let server: Server;

describe("products", () => {
  let categoryAID: number;
  let categoryBID: number;

  let itemCID: number;

  beforeAll(async () => {
    server = await createTestServer();
    console.error = jest.fn();

    await clearAndPopDB();

    const categories = await db.query("SELECT * FROM categories");
    categoryAID = categories.rows[0].id;
    categoryBID = categories.rows[1].id;

    itemCID = (
      await db.query("SELECT * FROM products WHERE name='Test Item 3'")
    ).rows[0].id;
  });

  afterAll(async () => {
    await db.end();
    server.close();
  });

  describe("GET /products", () => {
    it("returns all products if no category specified", async () => {
      const response = await request(server).get("/products");

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          {
            id: expect.any(Number),
            name: "Test Item 1",
            description: "This is Test Item 1",
            price: "10",
            categoryId: categoryAID,
          },
          {
            id: expect.any(Number),
            name: "Test Item 2",
            description: "This is Test Item 2",
            price: "20",
            categoryId: categoryBID,
          },
          {
            id: itemCID,
            name: "Test Item 3",
            description: "This is Test Item 3",
            price: "30",
            categoryId: categoryAID,
          },
          {
            id: expect.any(Number),
            name: "Test Item 4",
            description: null,
            price: "40",
            categoryId: categoryBID,
          },
        ])
      );
    });

    it("returns products filtered by category", async () => {
      const response = await request(server).get(
        `/products?category=${categoryAID}`
      );

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          {
            id: expect.any(Number),
            name: "Test Item 1",
            description: "This is Test Item 1",
            price: "10",
            categoryId: categoryAID,
          },
          {
            id: itemCID,
            name: "Test Item 3",
            description: "This is Test Item 3",
            price: "30",
            categoryId: categoryAID,
          },
        ])
      );
    });

    it("returns 200 if category has no products", async () => {
      const response = await request(server).get("/products?category=999");

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual([]);
    });

    it("returns 400 if category is not a number", async () => {
      const response = await request(server).get("/products?category=abc");

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        message: "Invalid category",
        name: "BadRequestError",
        status: 400,
      });
    });
  });

  describe("GET /products/:id", () => {
    it("returns a product by id", async () => {
      const response = await request(server).get(`/products/${itemCID}`);

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({
        id: itemCID,
        name: "Test Item 3",
        description: "This is Test Item 3",
        price: "30",
        categoryId: categoryAID,
      });
    });

    it("returns 404 if product is not found", async () => {
      const response = await request(server).get("/products/9992321");

      expect(response.status).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body).toEqual({
        message: "Product not found",
        name: "NotFoundError",
        status: 404,
      });
    });

    it("returns 400 if id is not a number", async () => {
      const response = await request(server).get("/products/abc");

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        message: "Invalid id",
        name: "BadRequestError",
        status: 400,
      });
    });
  });
});
