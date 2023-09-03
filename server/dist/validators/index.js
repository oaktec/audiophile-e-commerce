"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidationRules = exports.cartValidationRules = exports.authValidationRules = void 0;
const auth_1 = require("./auth");
const cart_1 = require("./cart");
const user_1 = require("./user");
exports.authValidationRules = {
    registerValidationRules: auth_1.registerValidationRules,
};
exports.cartValidationRules = {
    checkoutValidationRules: cart_1.checkoutValidationRules,
    quantityValidationRules: cart_1.quantityValidationRules,
};
exports.userValidationRules = {
    updateUserValidationRules: user_1.updateUserValidationRules,
};
