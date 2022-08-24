'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Appointments', {
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
      senderId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      senderName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      receiverId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      receiverName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      severity: {
        allowNull: false,
        type: Sequelize.STRING
      },
      channel: {
        allowNull: false,
        type: Sequelize.ENUM('Audio call', 'Video call', 'Physical Visit')
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      venue: {
        allowNull: true,
        type: Sequelize.STRING
      },
      purpose: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('Accepted', 'Declined')
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
    await queryInterface.dropTable('Appointments');
  }
};
