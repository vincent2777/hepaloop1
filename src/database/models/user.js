'use strict';

import { v4 as uuidV4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      /*User.hasOne(models.Doctors, {
        as: "userInfo",
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true,
      });
      User.hasOne(models.Individuals, {
        as: "individualInfo",
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true,
      });
      User.hasOne(models.Hospitals, {
        as: "hospitalInfo",
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true,
      });
      User.hasOne(models.Pharmacies, {
        as: "pharmacyInfo",
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true,
      });*/

      User.hasMany(models.Consultations, {
        as: "consultations",
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true
      });
      /*User.hasMany(models.Notifications, {
        as: "notifications",
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true
      });*/
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    picture: DataTypes.STRING,
    role: DataTypes.ENUM('Admin', 'Doctor', 'Hospital', 'Individual', 'Pharmacy')
  }, {
    sequelize,
    modelName: 'Users',
    tableName: 'Users',
    freezeTableName: true
  });

  //  Before the Records will be created, let's d the following.
  User.beforeCreate((user) => {
    user.id = uuidV4();
  });
  User.beforeCreate((user) => {
    user.password = bcrypt.hashSync(user.password, 10);
  });

  //  After the record is persisted and before the persisted data are returned, let's remove the "password".
  User.afterCreate((user) => {
    delete user.dataValues.password
  });

  return User;
};