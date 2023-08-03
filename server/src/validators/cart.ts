import { ValidationChain, body } from "express-validator";

export const quantityValidationRules: ValidationChain[] = [
  body("quantity")
    .exists()
    .withMessage("Quantity is required")
    .isInt({ min: 1, max: 100 })
    .withMessage("Quantity should be greater than 0 and less than 100"),
];
