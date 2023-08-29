import { ValidationChain, body } from "express-validator";

export const quantityValidationRules: ValidationChain[] = [
  body("quantity")
    .exists()
    .withMessage("Quantity is required")
    .isInt({ min: 1, max: 100 })
    .withMessage("Quantity should be greater than 0 and less than 100"),
];
export const checkoutValidationRules: ValidationChain[] = [
  body("address")
    .exists()
    .withMessage("Address is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Address should be between 2 and 100 characters"),
  body("city")
    .exists()
    .withMessage("City is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("City should be between 2 and 100 characters"),
  body("postcode")
    .exists()
    .withMessage("Postcode is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Postcode should be between 2 and 100 characters"),
  body("paymentMethod")
    .exists()
    .withMessage("Payment method is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Payment method should be between 2 and 100 characters"),
  body("phone")
    .isLength({ min: 2, max: 100 })
    .withMessage("Phone should be between 2 and 100 characters")
    .optional(),
];
