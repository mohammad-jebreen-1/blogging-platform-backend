module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { DataTypes } = Sequelize;

    return queryInterface.createTable("users", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable("users");
  },
};
