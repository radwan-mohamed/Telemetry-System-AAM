// database/connection.js
const { SensorReading, sequelize } = require('../models');

class TelemetryDB {
  // Get the single most-recent reading for a given sensor type
  async getLatestReading(sensorType) {
    return await SensorReading.findOne({
      where: { sensor_type: sensorType },
      order: [['timestamp', 'DESC']]
    });
  }

  // Get the latest N readings for a given sensor type
  async getLatestReadings(sensorType, limit = 10) {
    return await SensorReading.findAll({
      where: { sensor_type: sensorType },
      order: [['timestamp', 'DESC']],
      limit: Math.max(1, parseInt(limit, 10))
    });
  }

  // Get the N most recent readings for history purposes
  async getReadingHistory(sensorType, limit = 100) {
    return await SensorReading.findAll({
      where: { sensor_type: sensorType },
      order: [['timestamp', 'DESC']],
      limit: Math.max(1, parseInt(limit, 10))
    });
  }

  // Get the latest reading for each sensor type
  async getAllLatestReadings() {
    const [results] = await sequelize.query(`
      SELECT sr1.*
      FROM sensor_readings sr1
      JOIN (
        SELECT sensor_type, MAX(timestamp) AS max_timestamp
        FROM sensor_readings
        GROUP BY sensor_type
      ) sr2
      ON sr1.sensor_type = sr2.sensor_type
      AND sr1.timestamp = sr2.max_timestamp
    `);
    return results;
  }
}

module.exports = new TelemetryDB();
