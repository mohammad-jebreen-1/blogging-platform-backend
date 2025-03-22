import { AuthConnector } from "../connectors/index.js";
import { BlogsSchema } from "./_schemas/index.js";

export const BlogsModel = AuthConnector.define("blogs", BlogsSchema, {
  timestamps: true,
  underscored: true,
});
