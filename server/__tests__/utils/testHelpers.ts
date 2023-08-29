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
  await db.query("DELETE FROM orders");
  await db.query("DELETE FROM carts");
};

export const registerAndLoginAgent = async (
  agent: request.SuperAgentTest,
  secondAgent = false
) => {
  let details = {
    email: "lola@granola.com",
    password: "lol4TheB3st1!",
    firstName: "Lola",
    lastName: "Granola",
  };

  if (secondAgent) {
    details = {
      email: "second@agent.com",
      password: "secondAg3nt!!",
      firstName: "Second",
      lastName: "Agent",
    };
  }

  const response = await agent.post("/auth/register").send(details);

  expect(response.status).toBe(201);

  return response;
};

export const giveAgentACartWithProducts = async (
  agent: request.SuperAgentTest
) => {
  const { rows } = await db.query("SELECT * FROM products LIMIT 2");

  const productIds = rows.map((product) => product.id);

  await agent.post(`/cart/add/${productIds[0]}`).send({ quantity: 1 });
  await agent.post(`/cart/add/${productIds[1]}`).send({ quantity: 2 });

  const cartResponse = await agent.get("/cart");

  return cartResponse;
};

export const giveAgentSomeOrders = async (agent: request.SuperAgentTest) => {
  await giveAgentACartWithProducts(agent);

  const cartResponse = await agent.post(`/cart/checkout`);

  expect(cartResponse.status).toBe(204);

  await giveAgentACartWithProducts(agent);

  const secondCartResponse = await agent.post(`/cart/checkout`);

  expect(secondCartResponse.status).toBe(204);

  return secondCartResponse;
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
      slug: "test-item-1",
      features: "This is Test Item 1 features",
    },
    {
      name: "Test Item 2",
      description: "This is Test Item 2",
      price: 20,
      categoryId: categoryIds[1],
      slug: "test-item-2",
      features: "This is Test Item 2 features",
    },
    {
      name: "Test Item 3",
      description: "This is Test Item 3",
      price: 30,
      categoryId: categoryIds[0],
      slug: "test-item-3",
      features: "This is Test Item 3 features",
    },
    {
      name: "Test Item 4",
      price: 40,
      categoryId: categoryIds[1],
      slug: "test-item-4",
      features: "This is Test Item 4 features",
    },
  ];

  const testBoxContents = [
    {
      name: "Test Item 1",
      quantity: 1,
    },
    {
      name: "Test Item 2",
      quantity: 3,
    },
  ];

  const similarProducts = ["test-item-1", "test-item-2", "test-item-4"];

  const testUsers = [
    {
      email: "demo@user.com",
      password: "password",
      firstName: "Demo",
      lastName: "User",
    },
    {
      email: "testy@email.com",
      password: "testpassword",
      firstName: "Test",
      lastName: "User",
    },
  ];

  await Promise.all(
    testProducts.map(async (product) => {
      await db.query(
        "INSERT INTO products (name, description, price, category_id, slug, features) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          product.name,
          product.description,
          product.price,
          product.categoryId,
          product.slug,
          product.features,
        ]
      );
    })
  );

  const { rows } = await db.query(
    "SELECT id FROM products WHERE name = 'Test Item 3'"
  );
  const testItem3Id = rows[0].id;

  await Promise.all(
    testBoxContents.map(async (boxContent) => {
      await db.query(
        "INSERT INTO product_box_contents (product_id, item, quantity) VALUES ($1, $2, $3)",
        [testItem3Id, boxContent.name, boxContent.quantity]
      );
    })
  );

  await Promise.all(
    similarProducts.map(async (slug) => {
      const { rows } = await db.query(
        "SELECT id FROM products WHERE slug = $1",
        [slug]
      );

      await db.query(
        "INSERT INTO similar_products (product_id, similar_product_id) VALUES ($1, $2)",
        [testItem3Id, rows[0].id]
      );
    })
  );

  await Promise.all(
    testUsers.map(async (user) => {
      await db.query(
        "INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4)",
        [user.email, user.password, user.firstName, user.lastName]
      );
    })
  );
};
