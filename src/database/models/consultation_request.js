'use strict';

import { v4 as uuidV4 } from 'uuid';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class ConsultationRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ConsultationRequest.init({
    doctorId: DataTypes.UUID,
    individualId: DataTypes.UUID,
    status: DataTypes.ENUM('pending', 'accepted', 'rejected'),
  }, {
    tableName: 'ConsultationRequest',
    sequelize,
    modelName: 'ConsultationRequest',
    freezeTableName: true
  });

  //  Before the Records will be created, let's d the following.
  ConsultationRequest.beforeCreate(async (consultationRequest) => {
    consultationRequest.id = await uuidV4();
  });

  return ConsultationRequest;
};