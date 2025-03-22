import jsonWebToken from "jsonwebtoken";
import { StatusCode } from "../constants/index.js";
import AppConfigs from "../config/config.js";

export const TokenValidator = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.sendStatus(StatusCode.UNAUTHORIZED);

  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(StatusCode.UNAUTHORIZED);

  try {
    req.user = jsonWebToken.verify(token, AppConfigs.security.token.secret);
  } catch (error) {
    if (error instanceof jsonWebToken.TokenExpiredError) {
      return res
        .status(StatusCode.UNAUTHORIZED)
        .json({ message: "Token has expired" });
    }

    return res.sendStatus(StatusCode.UNAUTHORIZED);
  }

  next();
};
