"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importStar(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const errorHandlingMiddleware = (err, req, res, next) => {
    let error;
    if ((0, http_errors_1.isHttpError)(err)) {
        error = err;
    }
    else {
        console.error(err);
        error = (0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, err.message);
    }
    const errorRet = {
        message: error.message || "An unknown error occurred",
        status: error.statusCode || 500,
        name: error.name || "UnknownError",
    };
    res.status(errorRet.status).json(errorRet);
};
exports.default = errorHandlingMiddleware;
