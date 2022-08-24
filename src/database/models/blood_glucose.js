'use strict';

import { v4 as uuidV4 } from 'uuid';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class BloodGlucose extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BloodGlucose.belongsTo(models.Users, {
        as: "patient",
        foreignKey: "patientId",
        onDelete: "CASCADE",
        hooks: true
      });
      BloodGlucose.belongsTo(models.Users, {
        as: "doctor",
        foreignKey: "doctorId",
        onDelete: "CASCADE",
        hooks: true
      });
    }
  }
  BloodGlucose.init({
    patientId: DataTypes.UUID,
    doctorId: DataTypes.UUID,
    fasting: DataTypes.DOUBLE,
    random: DataTypes.DOUBLE,
    twoHours: DataTypes.DOUBLE,
    unit: DataTypes.ENUM('mmol/L', 'mg/dL'),
    outOfRange: DataTypes.BOOLEAN
  }, {
    sequelize,
    sequelize,
    modelName: 'BloodGlucose',
    tableName: 'BloodGlucose',
    freezeTableName: true
  });


  //  Before the Records will be created, let's d the following.
  BloodGlucose.beforeCreate(async (bloodGlucose) => {
    bloodGlucose.id = uuidV4();
  });

  return BloodGlucose;
};