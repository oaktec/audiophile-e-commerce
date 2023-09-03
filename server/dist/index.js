"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const db_1 = __importDefault(require("./db"));
const createServer_1 = __importDefault(require("./server/createServer"));
const config_1 = require("./config");
const startServer = async () => {
    const port = config_1.PORT;
    if (!port) {
        throw new Error("Missing PORT env var. Set it and restart the server");
    }
    try {
        const res = await db_1.default.checkConnection();
        console.info(`Connected to database: ${res.rows[0].now}`);
        const app = (0, createServer_1.default)();
        app.listen(port, () => {
            console.info(`Server is listening on port ${port}`);
        });
        return app;
    }
    catch (err) {
        console.error(`Failed to start the server: ${err}`);
        process.exit(1);
    }
};
exports.default = startServer();
