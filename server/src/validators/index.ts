import { registerValidationRules } from "./auth";
import { updateUserValidationRules } from "./user";

export const authValidationRules = {
  registerValidationRules,
};

export const userValidationRules = {
  updateUserValidationRules,
};
