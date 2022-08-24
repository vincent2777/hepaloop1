'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Doctors', {
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
        type: Sequelize.UUID,
      },
      gender: {
        allowNull: false,
        type: Sequelize.ENUM('Male', 'Female')
      },
      specialty: {
        allowNull: false,
        type: Sequelize.STRING
      },
      hospital: {
        allowNull: false,
        type: Sequelize.STRING
      },
      syop: {
        allowNull: false,
        type: Sequelize.STRING
      },
      bioInfo: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      rating: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: '0.0'
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
    await queryInterface.dropTable('Doctors');
  }
};
