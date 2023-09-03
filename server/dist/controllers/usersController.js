"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const services_1 = require("../services");
const middlewares_1 = require("../middlewares");
exports.default = {
    getUserById: async (req, res, next) => {
        const id = Number(req.params.userId);
        const unsafeUser = await services_1.userService.getById(id);
        if (!unsafeUser) {
            return next((0, http_errors_1.default)(404, "User not found"));
        }
        res.json({
            id: unsafeUser.id,
            email: unsafeUser.email,
            firstName: unsafeUser.firstName,
            lastName: unsafeUser.lastName,
        });
    },
    updateUserById: [
        middlewares_1.validationMiddleware,
        async (req, res, next) => {
            const id = Number(req.params.userId);
            const unsafeUser = await services_1.userService.getById(id);
            if (!unsafeUser) {
                return next((0, http_errors_1.default)(404, "User not found"));
            }
            const { email, password, firstName, lastName } = req.body;
            if (email !== unsafeUser.email) {
                const existingUser = await services_1.userService.getByEmail(email);
                if (existingUser) {
                    return next((0, http_errors_1.default)(409, "Email already in use"));
                }
            }
            const updateData = {
                email,
                firstName,
                lastName,
            };
            let hashedPassword;
            if (password) {
                hashedPassword = await bcrypt_1.default.hash(password, 10);
                updateData.password = hashedPassword;
            }
            const updatedUser = await services_1.userService.updateById(id, updateData);
            if (!updatedUser) {
                return next((0, http_errors_1.default)(500, "Failed to update user"));
            }
            res.json({
                id: updatedUser.id,
                email: updatedUser.email,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
            });
        },
    ],
    deleteUserById: async (req, res, next) => {
        const id = Number(req.params.userId);
        const unsafeUser = await services_1.userService.getById(id);
        if (!unsafeUser) {
            return next((0, http_errors_1.default)(404, "User not found"));
        }
        const deletedUser = await services_1.userService.deleteById(id);
        if (!deletedUser) {
            return next((0, http_errors_1.default)(500, "Failed to delete user"));
        }
        res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send();
    },
};
