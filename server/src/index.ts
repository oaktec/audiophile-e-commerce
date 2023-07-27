import { config } from "dotenv";

config();

import db from "./db";
import createServer from "./server/createServer";
import { PORT } from "./config";

const startServer = async () => {
  const port = PORT;
  if (!port) {
    throw new Error("Missing PORT env var. Set it and restart the server");
  }

  try {
    const res = await db.checkConnection();
    console.info(`Connected to database: ${res.rows[0].now}`);

    const app = createServer();
    app.listen(port, () => {
      console.info(`Server is listening on port ${port}`);
    });

    return app;
  } catch (err) {
    console.error(`Failed to start the server: ${err}`);
    process.exit(1);
  }
};

export default startServer();
