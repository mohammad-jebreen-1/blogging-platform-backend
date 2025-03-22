import expressRouter from "express-async-router";

import { BlogsRouterSchema } from "./_schemas/index.js";
import { BlogsController } from "../controllers/index.js";
import { StatusCode } from "../constants/index.js";
import { Upload } from "../utils/index.js";
import { TokenValidator, BlogPermission } from "../middleware/index.js";

export const BlogsRouter = new expressRouter.AsyncRouter({ mergeParams: true });

BlogsRouter.post(
  "/",
  [TokenValidator, Upload.single("image"), BlogsRouterSchema.create],
  async (req, res) => {
    const newBlog = await BlogsController.create(req, res);
    res.status(StatusCode.CREATED).json(newBlog);
  }
);

BlogsRouter.get("/", TokenValidator, async (req, res) => {
  const blogs = await BlogsController.getAll(res);
  res.status(StatusCode.OK).json(blogs);
});

BlogsRouter.get(
  "/:id",
  [TokenValidator, BlogsRouterSchema.blogId],
  async (req, res) => {
    const { id } = req.params;

    const blog = await BlogsController.getById(id, res);
    res.status(StatusCode.OK).json(blog);
  }
);

BlogsRouter.get(
  "/user/:id",
  [TokenValidator, BlogsRouterSchema.userId],
  async (req, res) => {
    const { id } = req.params;
    console.log("e5ceef58-ae1e-4422-9a84-ididididi");

    const userBlogs = await BlogsController.getBlogsByUserId(id, res);
    res.status(StatusCode.OK).json(userBlogs);
  }
);

BlogsRouter.patch(
  "/:id",
  [
    TokenValidator,
    Upload.single("image"),
    BlogsRouterSchema.blogId,
    BlogPermission.checkBlogOwnership,
  ],
  async (req, res) => {
    const { id } = req.params;

    await BlogsController.patch(id, req, res);
    res.status(StatusCode.OK).json({ message: "Blog deleted" });
  }
);

BlogsRouter.delete(
  "/:id",
  [TokenValidator, BlogsRouterSchema.blogId, BlogPermission.checkBlogOwnership],
  async (req, res) => {
    const { id } = req.params;

    await BlogsController.delete(id, res);
    res.status(StatusCode.OK).json({ message: "Blog deleted" });
  }
);
