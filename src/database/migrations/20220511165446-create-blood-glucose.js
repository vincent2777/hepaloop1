'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BloodGlucose', {
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
      fasting: {
        allowNull: true,
        type: Sequelize.DOUBLE
      },
      random: {
        allowNull: true,
        type: Sequelize.DOUBLE
      },
      twoHours: {
        allowNull: true,
        type: Sequelize.DOUBLE
      },
      unit: {
        allowNull: false,
        type: Sequelize.ENUM('mg/dL', 'mmol/L'),
        defaultValue: 'mg/dL'
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
    await queryInterface.dropTable('BloodGlucose');
  }
};