import request from "supertest";
import { Server } from "http";
import { StatusCodes } from "http-status-codes";

import db from "../../src/db";
import { clearDatabase, createTestServer } from "../utils/testHelpers";

let server: Server;

describe("products", () => {
  let categoryAID: number;
  let categoryBID: number;

  let itemCID: number;

  beforeAll(async () => {
    server = await createTestServer();
    console.error = jest.fn();

    await db.query("INSERT INTO categories (name) VALUES ($1)", [
      "First category",
    ]);
    await db.query("INSERT INTO categories (name) VALUES ($1)", [
      "Second category",
    ]);

    const categories = await db.query("SELECT * FROM categories");
    categoryAID = categories.rows[0].id;
    categoryBID = categories.rows[1].id;

    await db.query(
      "INSERT INTO products (name, description, price, category_id) VALUES ($1, $2, $3, $4)",
      ["Test Item 1", "This is Test Item 1", 10, categoryAID]
    );
    await db.query(
      "INSERT INTO products (name, description, price, category_id) VALUES ($1, $2, $3, $4)",
      ["Test Item 2", "This is Test Item 2", 20, categoryBID]
    );
    await db.query(
      "INSERT INTO products (name, description, price, category_id) VALUES ($1, $2, $3, $4)",
      ["Test Item 3", "This is Test Item 3", 30, categoryAID]
    );
    await db.query(
      "INSERT INTO products (name, price, category_id) VALUES ($1, $2, $3)",
      ["Test Item 4", 40, categoryBID]
    );

    itemCID = (await db.query("SELECT * FROM products")).rows[2].id;
  });

  afterAll(async () => {
    await clearDatabase();
    await db.end();
    server.close();
  });

  describe("GET /products", () => {
    it("returns all products if no category specified", async () => {
      const response = await request(server).get("/products");

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual([
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
      ]);
    });

    it("returns products filtered by category", async () => {
      const response = await request(server).get(
        `/products?category=${categoryAID}`
      );

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual([
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
      ]);
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
