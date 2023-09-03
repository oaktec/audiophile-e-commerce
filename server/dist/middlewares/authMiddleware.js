"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const isAuth = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You must be logged in to do that"));
    }
    next();
};
exports.default = {
    isAuth,
    isUserFromParams: [
        isAuth,
        (req, res, next) => {
            const id = Number(req.params.userId);
            if (isNaN(id) || id < 0) {
                return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid user id"));
            }
            const userId = req.user?.id;
            if (userId !== id) {
                return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.FORBIDDEN, "You do not have permission to do that"));
            }
            next();
        },
    ],
    isGuest: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, "You are already logged in"));
        }
        next();
    },
};
