"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const http_status_codes_1 = require("http-status-codes");
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("../routes"));
const middlewares_1 = require("../middlewares");
const session_1 = __importDefault(require("../config/session"));
const passport_1 = __importDefault(require("../config/passport"));
const config_1 = require("../config");
const createServer = () => {
    const app = (0, express_1.default)();
    const corsOptions = {
        origin: config_1.CORS_CLIENT_URL,
        credentials: true,
        optionsSuccessStatus: http_status_codes_1.StatusCodes.OK,
    };
    let morganFormat = "";
    switch (config_1.NODE_ENV) {
        case "production":
            morganFormat = "combined";
            break;
        case "test":
            break;
        default:
            morganFormat = "dev";
            break;
    }
    if (morganFormat) {
        app.use((0, morgan_1.default)(morganFormat));
    }
    app.use((0, cors_1.default)(corsOptions), (0, helmet_1.default)(), express_1.default.json(), express_1.default.urlencoded({ extended: true }));
    app.set("trust proxy", 1);
    app.use(session_1.default);
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.use("/api", routes_1.default);
    app.use("*", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "../../client/build/index.html"));
    });
    app.all("/*", (req, res) => {
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send(http_status_codes_1.ReasonPhrases.NOT_FOUND);
    });
    app.use(middlewares_1.errorHandlingMiddleware);
    return app;
};
exports.default = createServer;
