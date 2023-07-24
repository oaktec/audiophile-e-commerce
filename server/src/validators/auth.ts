import { ValidationChain, body } from "express-validator";

const validateEmail = (): ValidationChain =>
  body("email")
    .trim()
    .toLowerCase()
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid");
const validatePassword = (): ValidationChain =>
  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 100 })
    .withMessage("Password should be between 8 and 100 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password should have a mix of uppercase and lowercase letters, include at least one numeric digit and one special character"
    );

export const loginValidationRules: ValidationChain[] = [
  validateEmail(),
  validatePassword(),
];

export const registerValidationRules: ValidationChain[] = [
  validateEmail(),
  validatePassword(),
  body("firstName")
    .exists()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name should be between 2 and 50 characters")
    .matches(/^[a-zA-Z-']*$/)
    .withMessage("First name should only include alphabetic characters"),
  body("lastName")
    .exists()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name should be between 2 and 50 characters")
    .matches(/^[a-zA-Z-']*$/)
    .withMessage("Last name should only include alphabetic characters"),
  body("address")
    .exists()
    .withMessage("Address is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Address should be between 5 and 100 characters"),
];
