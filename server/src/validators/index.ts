import { registerValidationRules } from "./auth";
import { checkoutValidationRules, quantityValidationRules } from "./cart";
import { updateUserValidationRules } from "./user";

export const authValidationRules = {
  registerValidationRules,
};

export const cartValidationRules = {
  checkoutValidationRules,
  quantityValidationRules,
};

export const userValidationRules = {
  updateUserValidationRules,
};
