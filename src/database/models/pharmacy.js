'use strict';

import { v4 as uuidV4 } from "uuid";
import bcrypt from "bcryptjs";
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class Pharmacy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      /*Pharmacy.hasMany(models.Users, {
        as: "user",
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true
      });*/
      /*Pharmacy.hasMany(models.Notifications, {
        as: "notifications",
        foreignKey: "pharmacyId",
        onDelete: "CASCADE",
        hooks: true
      });*/
    }
  }
  Pharmacy.init({
    userId: DataTypes.UUID,
    dor: DataTypes.STRING,
    profileInfo: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Pharmacies',
    tableName: 'Pharmacies',
    freezeTableName: true,
  });

  //  Before the Records will be created, let's do the following.
  Pharmacy.beforeCreate(async (pharmacy) => {
    pharmacy.id = uuidV4();
  });

  return Pharmacy;
};