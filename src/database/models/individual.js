'use strict';

import { v4 as uuidV4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class Individual extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Individual.belongsTo(models.Users, {
        as: "user",
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true
      });
      /*Individual.hasMany(models.Notifications, {
        as: "notifications",
        foreignKey: "senderId",
        onDelete: "CASCADE",
        hooks: true
      });*/
      /*Individual.hasMany(models.Consultations, {
        as: "consultations",
        foreignKey: "individualId",
        onDelete: "CASCADE",
        hooks: true
      });*/
      /*Individual.hasMany(models.Appointments, {
        as: "appointments",
        foreignKey: "individualId",
        onDelete: "CASCADE",
        hooks: true
      });*/
    }
  };
  Individual.init({
    userId: DataTypes.UUID,
    gender: DataTypes.ENUM('Select Gender', 'Male', 'Female'),
    dob: DataTypes.STRING,
    age: DataTypes.INTEGER,
    height: DataTypes.STRING,
    weight: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Individuals',
    tableName: 'Individuals',
    freezeTableName: true,
  });

  //  Before the Records will be created, let's d the following.
  Individual.beforeCreate(async (individual) => {
    individual.id = await uuidV4();
  });

  return Individual;
};
