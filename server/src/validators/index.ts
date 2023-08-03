import { registerValidationRules } from "./auth";
import { quantityValidationRules } from "./cart";
import { updateUserValidationRules } from "./user";

export const authValidationRules = {
  registerValidationRules,
};

export const cartValidationRules = {
  quantityValidationRules,
};

export const userValidationRules = {
  updateUserValidationRules,
};
