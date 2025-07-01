// database/connection.js

const mysql = require('mysql2/promise');
require('dotenv').config();

class TelemetryDB {
  constructor() {
    this.pool = mysql.createPool({
      host:               process.env.DB_HOST     || 'localhost',
      port:               parseInt(process.env.DB_PORT, 10) || 3306,
      user:               process.env.DB_USER     || 'root',
      password:           process.env.DB_PASSWORD || 'Aam@1234',
      database:           process.env.DB_NAME     || 'formula_telemetry',
      waitForConnections: true,
      connectionLimit:    10,
      queueLimit:         0
    });
  }

  // Get the single most-recent reading for a given sensor type
  async getLatestReading(sensorType) {
    const [rows] = await this.pool.execute(
      'SELECT * FROM sensor_readings WHERE sensor_type = ? ORDER BY timestamp DESC LIMIT 1',
      [sensorType]
    );
    return rows[0]; // undefined if no rows
  }

  // Get the latest N readings for a given sensor type
  async getLatestReadings(sensorType, limit = 10) {
    const safeLimit = Math.max(1, parseInt(limit, 10));
    const sql = `
      SELECT *
        FROM sensor_readings
       WHERE sensor_type = ?
       ORDER BY timestamp DESC
       LIMIT ${safeLimit}
    `;
    const [rows] = await this.pool.execute(sql, [sensorType]);
    return rows;
  }

  // Get the N most recent readings for history purposes
  async getReadingHistory(sensorType, limit = 100) {
    const safeLimit = Math.max(1, parseInt(limit, 10));
    const sql = `
      SELECT *
        FROM sensor_readings
       WHERE sensor_type = ?
       ORDER BY timestamp DESC
       LIMIT ${safeLimit}
    `;
    const [rows] = await this.pool.execute(sql, [sensorType]);
    return rows;
  }

  // Get the latest reading for each sensor type
  async getAllLatestReadings() {
    const [rows] = await this.pool.execute(`
      SELECT sr1.*
        FROM sensor_readings sr1
        JOIN (
          SELECT sensor_type, MAX(timestamp) AS max_timestamp
            FROM sensor_readings
           GROUP BY sensor_type
        ) sr2
          ON sr1.sensor_type = sr2.sensor_type
         AND sr1.timestamp   = sr2.max_timestamp
    `);
    return rows;
  }
}

module.exports = new TelemetryDB();
