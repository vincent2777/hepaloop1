'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Notifications', {
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
      receiverId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('Consultation', 'Appointment', 'Chat', 'Call', 'Message', 'Reading', 'Update'),
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      refId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING
      },
      isDelivered: {
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
    await queryInterface.dropTable('Notifications');
  }
};
