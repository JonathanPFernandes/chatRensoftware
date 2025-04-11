import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {

    // Verifica se a tabela 'Reports' já existe
    const tableExists = await queryInterface.showAllTables()
      .then(tables => tables.includes('Reports'));

    if (!tableExists) {
      // Se a tabela não existir, cria a tabela com todas as colunas necessárias
      await queryInterface.createTable('Reports', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        ticketId: {
          type: DataTypes.INTEGER,
          references: { model: 'Tickets', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        queueId: {
          type: DataTypes.INTEGER,
          references: { model: 'Queues', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        contactId: {
          type: DataTypes.INTEGER,
          references: { model: 'Contacts', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        userId: {
          type: DataTypes.INTEGER,
          references: { model: 'Users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        startedAt: {
          type: DataTypes.DATE,
          allowNull: true
        },
        finishedAt: {
          type: DataTypes.DATE,
          allowNull: true
        },
        startedBy: {
          type: DataTypes.INTEGER,
          references: { model: 'Users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          allowNull: true
        },
        finishedBy: {
          type: DataTypes.INTEGER,
          references: { model: 'Users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          allowNull: true
        },
        atualStatus: {
          type: DataTypes.STRING,
          allowNull: true
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
      });
    }
  },

  down: async (queryInterface: QueryInterface) => {
    // Remove a tabela 'Reports' se necessário
    await queryInterface.dropTable('Reports');
  }
};
