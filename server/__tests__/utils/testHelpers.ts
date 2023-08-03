import { Server } from "http";
import request from "supertest";

import createServer from "../../src/server/createServer";
import db from "../../src/db";

export const createTestServer = async (port = 7777) => {
  const server = createServer();

  await db.checkConnection();

  return server.listen(port);
};

export const clearDatabase = async () => {
  const tables = await db.query(
    `SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`
  );

  await Promise.all(
    tables.rows.map(async (table) => {
      await db.query(`TRUNCATE TABLE ${table.table_name} CASCADE`);
    })
  );
};

export const deleteAllCarts = async (): Promise<void> => {
  await db.query("DELETE FROM cart_items");
  await db.query("DELETE FROM carts");
};

export const registerAndLoginAgent = async (
  server: Server,
  agent: request.SuperAgentTest,
  secondAgent = false
) => {
  let details = {
    email: "lola@granola.com",
    password: "lol4TheB3st1!",
    firstName: "Lola",
    lastName: "Granola",
    address: "123 Lola St",
  };

  if (secondAgent) {
    details = {
      email: "second@agent.com",
      password: "secondAg3nt!!",
      firstName: "Second",
      lastName: "Agent",
      address: "123 Second St",
    };
  }

  const response = await agent.post("/auth/register").send(details);

  expect(response.status).toBe(201);

  return response;
};

export const giveAgentACartWithProducts = async (
  agent: request.SuperAgentTest,
  agentId: number
) => {
  const cartResponse = await agent.post(`/cart/${agentId}`);

  expect(cartResponse.status).toBe(201);

  const { rows } = await db.query("SELECT * FROM products LIMIT 2");

  const productIds = rows.map((product) => product.id);

  await Promise.all(
    productIds.map(async (productId, index) => {
      const productResponse = await agent
        .post(`/cart/${agentId}/add/${productId}`)
        .send({ quantity: index + 1 });

      expect(productResponse.status).toBe(200);
    })
  );

  return cartResponse;
};

export const clearAndPopDB = async () => {
  await clearDatabase();

  await db.query("INSERT INTO categories (name) VALUES ($1)", [
    "First category",
  ]);
  await db.query("INSERT INTO categories (name) VALUES ($1)", [
    "Second category",
  ]);

  const categories = await db.query("SELECT * FROM categories");
  const categoryIds = categories.rows.map((category) => category.id);

  const testProducts = [
    {
      name: "Test Item 1",
      description: "This is Test Item 1",
      price: 10,
      categoryId: categoryIds[0],
    },
    {
      name: "Test Item 2",
      description: "This is Test Item 2",
      price: 20,
      categoryId: categoryIds[1],
    },
    {
      name: "Test Item 3",
      description: "This is Test Item 3",
      price: 30,
      categoryId: categoryIds[0],
    },
    {
      name: "Test Item 4",
      price: 40,
      categoryId: categoryIds[1],
    },
  ];

  const testUsers = [
    {
      email: "demo@user.com",
      password: "password",
      firstName: "Demo",
      lastName: "User",
      address: "123 Main St",
    },
    {
      email: "testy@email.com",
      password: "testpassword",
      firstName: "Test",
      lastName: "User",
      address: "1 Test St",
    },
  ];

  await Promise.all(
    testProducts.map(async (product) => {
      await db.query(
        "INSERT INTO products (name, description, price, category_id) VALUES ($1, $2, $3, $4)",
        [product.name, product.description, product.price, product.categoryId]
      );
    })
  );

  await Promise.all(
    testUsers.map(async (user) => {
      await db.query(
        "INSERT INTO users (email, password, first_name, last_name, address) VALUES ($1, $2, $3, $4, $5)",
        [user.email, user.password, user.firstName, user.lastName, user.address]
      );
    })
  );
};
