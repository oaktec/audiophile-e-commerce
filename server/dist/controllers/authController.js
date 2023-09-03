"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const http_errors_1 = __importDefault(require("http-errors"));
const passport_1 = __importDefault(require("passport"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const services_1 = require("../services");
const middlewares_1 = require("../middlewares");
exports.default = {
    loginUser: [
        (req, res, next) => {
            passport_1.default.authenticate("local", (err, user) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, "Incorrect email or password"));
                }
                req.logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }
                    return res.json({
                        id: user.id,
                    });
                });
            })(req, res, next);
        },
    ],
    registerUser: [
        middlewares_1.validationMiddleware,
        async (req, res, next) => {
            const { email, password, firstName, lastName, address } = req.body;
            const existingUser = await services_1.userService.getByEmail(email);
            if (existingUser) {
                return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.CONFLICT, "Email already in use"));
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const user = await services_1.userService.create({
                email,
                password: hashedPassword,
                firstName,
                lastName,
                address,
            });
            if (!user) {
                return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "User could not be created"));
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                });
            });
        },
    ],
    logoutUser: (req, res, next) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.session.destroy((destroyErr) => {
                if (destroyErr) {
                    return next(destroyErr);
                }
                return res.status(http_status_codes_1.StatusCodes.NO_CONTENT).end();
            });
        });
    },
    checkSession: async (req, res, next) => {
        if (req.user) {
            const user = await services_1.userService.getById(req.user.id);
            if (!user) {
                return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found"));
            }
            return res.json({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            });
        }
        return res.json({});
    },
};
