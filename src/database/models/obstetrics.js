'use strict';

import { v4 as uuidV4 } from 'uuid';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class Obstetrics extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Obstetrics.init({
    patientId: DataTypes.UUID,
    doctorId: DataTypes.UUID,
    kicks: DataTypes.INTEGER,
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Obstetrics',
    tableName: 'Obstetrics',
    freezeTableName: true
  });


  //  Before the Records will be created, let's d the following.
  Obstetrics.beforeCreate(async (obstetrics) => {
    obstetrics.id = uuidV4();
  });

  return Obstetrics;
};