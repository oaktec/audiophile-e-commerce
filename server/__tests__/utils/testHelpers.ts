import createServer from "../../src/server/createServer";
import db from "../../src/db";

export const createTestServer = async (port = 7777) => {
  const server = createServer();

  await db.checkConnection();

  return server.listen(port);
};

export const clearDatabase = async () => {
  await db.query("DELETE FROM users");
};
