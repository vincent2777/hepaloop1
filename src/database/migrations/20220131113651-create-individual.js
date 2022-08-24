'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Individuals', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      userId: {
        allowNull: false,
        // foreignKey: true,
        type: Sequelize.UUID,
      },
      gender: {
        allowNull: false,
        type: Sequelize.ENUM('Select Gender', 'Male', 'Female'),
        defaultValue: 'Select Gender'
      },
      dob: {
        allowNull: true,
        type: Sequelize.STRING
      },
      age: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      height: {
        allowNull: true,
        type: Sequelize.STRING
      },
      weight: {
        allowNull: true,
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Individuals');
  }
};
