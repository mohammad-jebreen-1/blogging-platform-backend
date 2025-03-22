import Sequelize from "sequelize";
const { DataTypes } = Sequelize;

export const UsersSchema = {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  passwordHash: {
    type: DataTypes.STRING,
    field: "password_hash",
  },
  passwordSalt: {
    type: DataTypes.STRING,
    field: "password_salt",
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: "created_at",
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: "updated_at",
  },
};
