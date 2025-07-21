const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME     || 'merlet_telemetry',
  process.env.DB_USER     || 'merlet',
  process.env.DB_PASSWORD || 'IzysQ4141',
  {
    host: process.env.DB_HOST || 'mysql-merlet.alwaysdata.net',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
  }
);

// Define SensorReading model
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
