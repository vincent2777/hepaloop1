'use strict';

import { v4 as uuidV4 } from 'uuid';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class DoctorPatient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DoctorPatient.belongsTo(models.Users, {
        as: 'patient',
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
    }
  }
  DoctorPatient.init({
    userId: DataTypes.ARRAY(DataTypes.UUID),
    doctorId: DataTypes.UUID,
    individualId: DataTypes.UUID,
    chatHistory: DataTypes.BOOLEAN,
    isBlocked: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'DoctorsPatients',
    tableName: 'DoctorsPatients',
    freezeTableName: true
  });

  //  Before the Records will be created, let's d the following.
  DoctorPatient.beforeCreate(async (doctorPatientRelation) => {
    doctorPatientRelation.id = await uuidV4();
  });

  return DoctorPatient;
};