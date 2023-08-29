import { ValidationChain, body } from "express-validator";

const validateEmail = (): ValidationChain =>
  body("email")
    .optional()
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Invalid email");

const validatePassword = (): ValidationChain =>
  body("password")
    .optional()
    .isLength({ min: 8, max: 100 })
    .withMessage("Password should be between 8 and 100 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password should have a mix of uppercase and lowercase letters, include at least one numeric digit and one special character"
    );

export const updateUserValidationRules: ValidationChain[] = [
  validateEmail(),
  validatePassword(),
  body("firstName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name should be between 2 and 50 characters")
    .matches(/^[a-zA-Z-' ]*$/)
    .withMessage("First name should only include alphabetic characters"),
  body("lastName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name should be between 2 and 50 characters")
    .matches(/^[a-zA-Z-' ]*$/)
    .withMessage("Last name should only include alphabetic characters"),
];
