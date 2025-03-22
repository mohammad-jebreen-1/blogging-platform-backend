import jsonWebToken from "jsonwebtoken";

import AppConfigs from "../config/config.js";

export const JwtHelper = {
  sign: async (claim) =>
    jsonWebToken.sign(claim, AppConfigs.security.token.secret, {
      expiresIn: AppConfigs.security.token.expiry * 100,
    }),
};
