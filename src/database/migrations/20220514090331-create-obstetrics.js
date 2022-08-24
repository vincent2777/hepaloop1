'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Obstetrics', {
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
      kicks: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      startTime: {
        allowNull: false,
        type: Sequelize.STRING
      },
      endTime: {
        allowNull: false,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Obstetrics');
  }
};