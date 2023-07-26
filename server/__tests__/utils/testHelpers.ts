import { QueryResult } from "pg";

import createServer from "../../src/server/createServer";
import db from "../../src/db";

export const createTestServer = (port = 7777) => {
  const server = createServer();

  db.queryCallback("SELECT NOW()", (err: Error | null, res: QueryResult) => {
    if (err) {
      console.error(err.stack);
    } else {
      console.info(res.rows[0]);
    }
  });

  return server.listen(port);
};

export const clearDatabase = async () => {
  await db.query("DELETE FROM users");
};
