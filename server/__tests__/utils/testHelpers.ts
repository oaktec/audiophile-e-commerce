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
