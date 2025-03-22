import Joi from "joi";
import { schemaValidator } from "../../middleware/index.js";

export const BlogsRouterSchema = {
  create: schemaValidator.body(
    Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
    })
  ),
  blogId: schemaValidator.params(
    Joi.object({
      id: Joi.string().uuid().required(),
    })
  ),
  userId: schemaValidator.params(
    Joi.object({
      id: Joi.string().uuid().required(),
    })
  ),
};
