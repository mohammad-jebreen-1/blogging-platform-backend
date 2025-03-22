import { BlogsModel } from "../models/index.js";
import { StatusCode } from "../constants/index.js";

const findBlogByIdAndUser = async (id, userId) => {
  return await BlogsModel.findOne({
    where: { id, userId },
  });
};

export const BlogPermission = {
  checkBlogOwnership: async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
      const blog = await findBlogByIdAndUser(id, userId);

      if (!blog) {
        return res.status(StatusCode.FORBIDDEN).json({
          message: "You do not have permission to modify this blog or it not existing",
        });
      }

      req.blog = blog;

      next();
    } catch (error) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Error processing the request",
        error: error.message,
      });
    }
  },
};
