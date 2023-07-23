import { body } from "express-validator";

export const loginValidationRules = [
  body("email").exists().isEmail(),
  body("password").exists().isLength({ min: 5 }),
];

export const registerValidationRules = [
  body("email").exists().isEmail(),
  body("password").exists().isLength({ min: 5 }),
  body("firstName").exists().isLength({ min: 2 }),
  body("lastName").exists().isLength({ min: 2 }),
  body("address").exists().isLength({ min: 5 }),
];
