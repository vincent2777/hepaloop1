'use strict';

import { v4 as uuidV4 } from 'uuid';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      /*Notification.belongsTo(models.Users, {
        as: "sender",
        foreignKey: "senderId"
      });*/
    }
  };
  Notification.init({
    userId: DataTypes.UUID,
    senderId: DataTypes.UUID,
    receiverId: DataTypes.UUID,
    type: DataTypes.ENUM('Consultation', 'Appointment', 'Chat', 'Call', 'Message', 'Reading', 'Update'),
    title: DataTypes.STRING,
    refId: DataTypes.UUID,
    content: DataTypes.STRING,
    isDelivered: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Notifications',
    tableName: 'Notifications',
    freezeTableName: true
  });

  //  Before the Records will be created, let's d the following.
  Notification.beforeCreate(async (notification) => {
    notification.id = await uuidV4();
  });

  return Notification;
};