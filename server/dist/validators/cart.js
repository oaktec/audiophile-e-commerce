"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutValidationRules = exports.quantityValidationRules = void 0;
const express_validator_1 = require("express-validator");
exports.quantityValidationRules = [
    (0, express_validator_1.body)("quantity")
        .exists()
        .withMessage("Quantity is required")
        .isInt({ min: 1, max: 100 })
        .withMessage("Quantity should be greater than 0 and less than 100"),
];
exports.checkoutValidationRules = [
    (0, express_validator_1.body)("address")
        .exists()
        .withMessage("Address is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Address should be between 2 and 100 characters"),
    (0, express_validator_1.body)("city")
        .exists()
        .withMessage("City is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("City should be between 2 and 100 characters"),
    (0, express_validator_1.body)("postcode")
        .exists()
        .withMessage("Postcode is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Postcode should be between 2 and 100 characters"),
    (0, express_validator_1.body)("paymentMethod")
        .exists()
        .withMessage("Payment method is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Payment method should be between 2 and 100 characters"),
    (0, express_validator_1.body)("phone")
        .isLength({ min: 2, max: 100 })
        .withMessage("Phone should be between 2 and 100 characters")
        .optional(),
];
