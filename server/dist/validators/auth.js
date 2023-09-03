"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerValidationRules = void 0;
const express_validator_1 = require("express-validator");
const validateEmail = () => (0, express_validator_1.body)("email")
    .trim()
    .toLowerCase()
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid");
const validatePassword = () => (0, express_validator_1.body)("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 100 })
    .withMessage("Password should be between 8 and 100 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage("Password should have a mix of uppercase and lowercase letters, include at least one numeric digit and one special character");
exports.registerValidationRules = [
    validateEmail(),
    validatePassword(),
    (0, express_validator_1.body)("firstName")
        .exists()
        .withMessage("First name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("First name should be between 2 and 50 characters")
        .matches(/^[a-zA-Z-' ]*$/)
        .withMessage("First name should only include alphabetic characters"),
    (0, express_validator_1.body)("lastName")
        .exists()
        .withMessage("Last name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Last name should be between 2 and 50 characters")
        .matches(/^[a-zA-Z-' ]*$/)
        .withMessage("Last name should only include alphabetic characters"),
];
