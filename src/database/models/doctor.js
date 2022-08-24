'use strict';

import { v4 as uuidV4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Doctor.belongsTo(models.Users, {
        as: "user",
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true
      });
    }
  };
  Doctor.init({
    userId: DataTypes.UUID,
    gender: DataTypes.ENUM('Male', 'Female'),
    specialty: DataTypes.STRING,
    hospital: DataTypes.STRING,
    syop: DataTypes.STRING,
    bioInfo: DataTypes.TEXT,
    rating: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Doctors',
    tableName: 'Doctors',
    freezeTableName: true,
  });

  //  Before the Records will be created, let's d the following.
  Doctor.beforeCreate(async (doctor) => {
    doctor.id = uuidV4();
  });

  return Doctor;
};
