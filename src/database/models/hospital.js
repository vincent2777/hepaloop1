'use strict';

import { v4 as uuidV4} from "uuid";
import bcrypt from "bcryptjs";
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class Hospital extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Hospital.belongsTo(models.Users, {
        as: "user",
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true
      });
      /*Hospital.hasMany(models.Notifications, {
        as: "notifications",
        foreignKey: "hospitalId",
        onDelete: "CASCADE",
        hooks: true
      });*/
    }
  };
  Hospital.init({
    userId: DataTypes.UUID,
    dor: DataTypes.STRING,
    profileInfo: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Hospitals',
    tableName: 'Hospitals',
    freezeTableName: true
  });

  //  Before the Records will be created, let's d the following.
  Hospital.beforeCreate(async (hospital) => {
    hospital.id = await uuidV4();
  });

  return Hospital;
};
