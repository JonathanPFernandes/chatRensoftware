import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Reports", "startedAt", {
      type: DataTypes.DATE,
      allowNull: true
    });
    await queryInterface.addColumn("Reports", "startedBy", {
      type: DataTypes.INTEGER,
      references: { model: "Users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      allowNull: true
    });
    await queryInterface.addColumn("Reports", "finishedBy", {
      type: DataTypes.INTEGER,
      references: { model: "Users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      allowNull: true
    });
    await queryInterface.addColumn("Reports", "atualStatus", {
      type: DataTypes.STRING,
      allowNull: true
    });
    // Adiciona o campo 'finishedAt'
    await queryInterface.addColumn("Reports", "finishedAt", {
      type: DataTypes.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Reports", "startedAt");
    await queryInterface.removeColumn("Reports", "finishedAt");
    await queryInterface.removeColumn("Reports", "startedBy");
    await queryInterface.removeColumn("Reports", "finishedBy");
    await queryInterface.removeColumn("Reports", "initialStatus");
    await queryInterface.removeColumn("Reports", "finalStatus");
    await queryInterface.removeColumn("Reports", "finishedAt"); // Remove o campo 'finishedAt'
  }
};