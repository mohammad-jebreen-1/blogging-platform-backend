import expressRouter from "express-async-router";

import { CommentsRouterSchema } from "./_schemas/index.js";
import { CommentsController } from "../controllers/index.js";
import { TokenValidator } from "../middleware/index.js";

export const CommentsRouter = new expressRouter.AsyncRouter({
  mergeParams: true,
});

CommentsRouter.post(
  "/",
  [TokenValidator, CommentsRouterSchema],
  CommentsController.create
);
