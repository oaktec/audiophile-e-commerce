import request from "supertest";
import { Server } from "http";
import { StatusCodes } from "http-status-codes";

import db from "../../src/db";
import { clearDatabase, createTestServer } from "../utils/testHelpers";

let server: Server;

describe.only("products", () => {
  let categoryAID: number;
  let categoryBID: number;

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
  });

  afterAll(async () => {
    await clearDatabase();
    await db.end();
    server.close();
  });

  describe("GET /products", () => {
    it("returns all products", async () => {
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
          id: expect.any(Number),
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
  });
});
