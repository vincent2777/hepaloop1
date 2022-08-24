'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DoctorsPatients', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      userId: {
        allowNull: false,
        foreignKey: true,
        type: Sequelize.ARRAY(Sequelize.UUID),
      },
      doctorId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      individualId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      chatHistory: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isBlocked: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('DoctorsPatients');
  }
};