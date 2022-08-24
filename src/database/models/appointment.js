'use strict';

import { v4 as uuidV4 } from 'uuid';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Appointment.belongsTo(models.Users, {
        as: "doctor",
        foreignKey: "userId"
      });
      Appointment.belongsTo(models.Users, {
        as: "individual",
        foreignKey: "userId"
      });
    }
  };
  Appointment.init({
    userId: DataTypes.UUID,
    senderId: DataTypes.UUID,
    senderName: DataTypes.STRING,
    receiverId: DataTypes.UUID,
    receiverName: DataTypes.STRING,
    severity: DataTypes.STRING,
    channel: DataTypes.ENUM('Audio call', 'Video call', 'Physical Visit'),
    date: DataTypes.DATE,
    time: DataTypes.DATE,
    venue: DataTypes.STRING,
    purpose: DataTypes.TEXT,
    status: DataTypes.ENUM('Accepted', 'Declined')
  }, {
    sequelize,
    modelName: 'Appointments',
    tableName: 'Appointments',
    freezeTableName: true
  });

  //  Before the Records will be created, let's d the following.
  Appointment.beforeCreate(async (appointment) => {
    appointment.id = uuidV4();
  });

  return Appointment;
};