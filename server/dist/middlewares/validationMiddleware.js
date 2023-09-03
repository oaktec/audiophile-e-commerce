"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const validationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        if (firstError !== undefined) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, firstError.msg));
        }
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, "An unknown validation error occurred"));
    }
    next();
};
exports.default = validationMiddleware;
