'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BloodPressure', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      patientId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      doctorId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      sys: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      dia: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      pulse: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      outOfRange: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('BloodPressure');
  }
};