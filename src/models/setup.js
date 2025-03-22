import { UsersModel, BlogsModel, CommentsModel } from "./index.js";

CommentsModel.belongsTo(UsersModel, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  as : "author"
});
CommentsModel.belongsTo(BlogsModel, {
  foreignKey: "blog_id",
  onDelete: "CASCADE",
});

BlogsModel.belongsTo(UsersModel, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  as: "author",
});
BlogsModel.hasMany(CommentsModel, { foreignKey: "blog_id" });
