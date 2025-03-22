import { BlogsModel, CommentsModel, UsersModel } from "../models/index.js";
import { StatusCode } from "../constants/index.js";

export const BlogsController = {
  create: async (req, res) => {
    try {
      const { title, description } = req.body;
      const { id: userId } = req.user;
      const imagePath = req.file ? req.file.path : null;

      const blog = await BlogsModel.create({
        title,
        description,
        image: imagePath,
        userId,
      });

      return res.status(StatusCode.CREATED).json(blog);
    } catch (err) {
      console.error(err);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  },

  getById: async (blogId, res) => {
    try {
      const blog = await BlogsModel.findOne({
        where: { id: blogId },
        include: [
          {
            model: UsersModel,
            as: "author",
            attributes: ["email"],
          },
          {
            model: CommentsModel,
            as: "comments",
            include: [
              {
                model: UsersModel,
                as: "author",
                attributes: ["email"],
              },
            ],
          },
        ],
      });

      if (!blog) {
        return res
          .status(StatusCode.NOT_FOUND)
          .json({ message: "Blog not found" });
      }

      return res.status(StatusCode.OK).json(blog);
    } catch (err) {
      console.error(err);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  },

  getBlogsByUserId: async (userId, res) => {
    try {
      const blogs = await BlogsModel.findAll({ where: { userId } });

      if (blogs.length === 0) {
        return res
          .status(StatusCode.NOT_FOUND)
          .json({ message: "No blogs found" });
      }

      return res.status(StatusCode.OK).json(blogs);
    } catch (err) {
      console.error(err);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  },

  getAll: async (res) => {
    try {
      const blogs = await BlogsModel.findAll({
        include: [
          {
            model: UsersModel,
            as: "author",
            attributes: ["email"],
          },
        ],
      });

      if (blogs.length === 0) {
        return res
          .status(StatusCode.NOT_FOUND)
          .json({ message: "No blogs found" });
      }

      return res.status(StatusCode.OK).json(blogs);
    } catch (err) {
      console.error(err);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  },

  patch: async (id, req, res) => {
    const { title, description } = req.body;
    const { file } = req;

    try {
      const blog = await BlogsModel.findOne({ where: { id } });

      if (!blog) {
        return res
          .status(StatusCode.NOT_FOUND)
          .json({ message: "Blog not found" });
      }

      const updatedData = {
        title,
        description,
      };

      if (file) {
        updatedData.image = file.path;
      }

      await BlogsModel.update(updatedData, { where: { id: id } });

      return res
        .status(StatusCode.OK)
        .json({ message: "Blog updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Error updating the blog",
        error: error.message,
      });
    }
  },

  delete: async (blogId, res) => {
    try {
      const blog = await BlogsModel.findOne({ where: { id: blogId } });

      if (!blog) {
        return res
          .status(StatusCode.NOT_FOUND)
          .json({ message: "Blog not found" });
      }

      await BlogsModel.destroy({ where: { id: blogId } });

      return res
        .status(StatusCode.OK)
        .json({ message: "Blog deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Error deleting the blog",
        error: error.message,
      });
    }
  },
};
