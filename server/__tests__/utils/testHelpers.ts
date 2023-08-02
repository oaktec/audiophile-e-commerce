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

export const registerAndLoginAgent = async (
  server: Server,
  agent: request.SuperAgentTest
) => {
  const response = await agent.post("/auth/register").send({
    email: "lola@granola.com",
    password: "lol4TheB3st1!",
    firstName: "Lola",
    lastName: "Granola",
    address: "123 Lola St",
  });

  expect(response.status).toBe(201);

  return response;
};
