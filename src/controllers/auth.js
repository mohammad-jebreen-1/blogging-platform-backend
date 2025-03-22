import { UsersModel } from "../models/index.js";
import { StatusCode } from "../constants/index.js";
import { PasswordHelper, JwtHelper } from "../utils/index.js";

export const AuthController = {
  register: async ({ email, password }, res) => {
    try {
      const existingUser = await UsersModel.findOne({ where: { email } });

      if (existingUser)
        return res
          .status(StatusCode.BAD_REQUEST)
          .json({ message: "User already exists" });

      const hashedPassword = await PasswordHelper.hash(password);

      const { dataValues } = await UsersModel.create({
        email,
        passwordHash: hashedPassword.hash,
        passwordSalt: hashedPassword.salt,
      });

      const token = await JwtHelper.sign({
        id: dataValues.id,
        email: dataValues.email,
      });

      return {
        message: "User successfully created",
        token,
        user: {
          id: dataValues.id,
          email: dataValues.email,
          createdAt: dataValues.createdAt,
          updatedAt: dataValues.updatedAt,
        },
      };
    } catch (error) {
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Server error", error });
    }
  },

  login: async ({ email, password }) => {
    const user = await UsersModel.findOne({
      where: { email: email.toLowerCase() },
    });

    if (user === null) return undefined;

    const verify = await PasswordHelper.verify(password, user.passwordHash);

    if (!verify) return undefined;

    const token = await JwtHelper.sign({
      id: user.id,
      email: user.email,
    });

    return {
      token,
    };
  },
};
