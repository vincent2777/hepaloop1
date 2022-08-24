'use strict';

import { v4 as uuidV4 } from 'uuid';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class Consultation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Consultation.belongsTo(models.Users, {
        as: "consultations",
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Consultation.init({
    userId: DataTypes.UUID,
    senderId: DataTypes.UUID,
    receiverId: DataTypes.UUID,
    status: DataTypes.ENUM('pending', 'accepted', 'rejected'),
  }, {
    sequelize,
    modelName: 'Consultations',
    tableName: 'Consultations',
    freezeTableName: true,
  });

  //  Before the Records will be created, let's do the following.
  Consultation.beforeCreate(async (consultation) => {
    consultation.id = await uuidV4();
  });

  return Consultation;
};