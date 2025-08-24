'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SensorReading extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SensorReading.init({
    sensor_type: DataTypes.STRING,
    value: DataTypes.FLOAT,
    timestamp: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'SensorReading',
  });
  return SensorReading;
};