import Joi from "joi";
import { schemaValidator } from "../../middleware/index.js";

export const AuthRouterSchema = schemaValidator.body(
  Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string().required(),
  })
);
