const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false
  }
);

const SensorReading = sequelize.define('SensorReading', {
  sensor_type: DataTypes.STRING,
  value: DataTypes.FLOAT,
  timestamp: DataTypes.DATE
}, {
  tableName: 'sensor_readings',
  timestamps: false
});

module.exports = {
  sequelize,
  SensorReading
};
