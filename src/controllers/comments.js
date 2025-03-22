import { CommentsModel } from "../models/index.js";
import { StatusCode } from "../constants/index.js";

export const CommentsController = {
  create: async (req, res) => {
    try {
      const { blogId, content } = req.body;
      const { id: userId } = req.user;

      const comment = await CommentsModel.create({
        blogId,
        userId,
        content,
      });

      return res
        .status(StatusCode.CREATED)
        .json({ message: "Comment added", comment });
    } catch (error) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Error adding comment",
        error: error.message,
      });
    }
  },
};
