import { AuthConnector } from "../connectors/index.js";
import { CommentsSchema } from "./_schemas/index.js";

export const CommentsModel = AuthConnector.define("comments", CommentsSchema, {
  timestamps: true,
  underscored: true,
});
