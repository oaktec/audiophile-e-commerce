import createServer from "../../src/server/createServer";
import db from "../../src/db";

export const createTestServer = async (port = 7777) => {
  const server = createServer();

  db.query("SELECT NOW()", (err: any, res: any) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`PostgreSQL connected: ${res.rows[0].now}`);
    }
  });

  return server.listen(port);
};

export const clearDatabase = async () => {
  await db.query("DELETE FROM users");
};
