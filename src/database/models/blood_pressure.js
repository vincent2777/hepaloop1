'use strict';

import { v4 as uuidV4 } from 'uuid';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class BloodPressure extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BloodPressure.init({
    patientId: DataTypes.UUID,
    doctorId: DataTypes.UUID,
    sys: DataTypes.INTEGER,
    dia: DataTypes.INTEGER,
    pulse: DataTypes.INTEGER,
    outOfRange: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'BloodPressure',
    tableName: 'BloodPressure',
    freezeTableName: true
  });


  //  Before the Records will be created, let's d the following.
  BloodPressure.beforeCreate(async (bloodPressure) => {
    bloodPressure.id = uuidV4();
  });

  return BloodPressure;
};