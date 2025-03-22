import expressRouter from "express-async-router";

import { AuthRouterSchema } from "./_schemas/index.js";
import { AuthController } from "../controllers/index.js";
import { StatusCode } from "../constants/index.js";

export const AuthRouter = new expressRouter.AsyncRouter({ mergeParams: true });

AuthRouter.post("/register", AuthRouterSchema, async (req, res) => {
  const newRegistration = await AuthController.register(req.body, res);
  res.status(StatusCode.CREATED).json(newRegistration);
});

AuthRouter.post("/login", AuthRouterSchema, async (req, res) => {
  const user = await AuthController.login(req.body);
  user
    ? res.status(StatusCode.OK).json(user)
    : res.status(StatusCode.UNAUTHORIZED).send();
});
