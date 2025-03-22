import Joi from "joi";
import { schemaValidator } from "../../middleware/index.js";

export const CommentsRouterSchema = schemaValidator.body(
  Joi.object({
    blogId: Joi.string().uuid().required(),
    content: Joi.string().min(1).max(500).required(),
  })
);
