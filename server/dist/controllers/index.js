"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = exports.ordersController = exports.productsController = exports.cartController = exports.authController = void 0;
const authController_1 = __importDefault(require("./authController"));
exports.authController = authController_1.default;
const cartController_1 = __importDefault(require("./cartController"));
exports.cartController = cartController_1.default;
const productsController_1 = __importDefault(require("./productsController"));
exports.productsController = productsController_1.default;
const ordersController_1 = __importDefault(require("./ordersController"));
exports.ordersController = ordersController_1.default;
const usersController_1 = __importDefault(require("./usersController"));
exports.usersController = usersController_1.default;
