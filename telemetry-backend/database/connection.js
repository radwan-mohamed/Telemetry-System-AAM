const mysql = require('mysql2/promise');
require('dotenv').config(); // Load .env variables

class TelemetryDB {
    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'telemetry',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    // Get the latest reading of a specific sensor (e.g., speed)
    async getLatestReading(sensorType) {
        const [rows] = await this.pool.execute(
            `SELECT * FROM sensor_readings 
             WHERE sensor_type = ? 
             ORDER BY timestamp DESC 
             LIMIT 1`,
            [sensorType]
        );
        return rows[0];
    }

    // Get the 10 most recent readings for a sensor
    async getLatestReadings(sensorType) {
        const [rows] = await this.pool.execute(
            `SELECT * FROM sensor_readings 
             WHERE sensor_type = ? 
             ORDER BY timestamp DESC 
             LIMIT 10`,
            [sensorType]
        );
        return rows;
    }

    // Get full history (limited) for a sensor
    async getReadingHistory(sensorType, limit = 100) {
        const [rows] = await this.pool.execute(
            `SELECT * FROM sensor_readings 
             WHERE sensor_type = ? 
             ORDER BY timestamp DESC 
             LIMIT ?`,
            [sensorType, limit]
        );
        return rows;
    }

    // Get the latest reading for each sensor type (speed, temp, etc.)
    async getAllLatestReadings() {
        const [rows] = await this.pool.execute(`
            SELECT sr1.* FROM sensor_readings sr1
            INNER JOIN (
                SELECT sensor_type, MAX(timestamp) as max_timestamp
                FROM sensor_readings
                GROUP BY sensor_type
            ) sr2 
            ON sr1.sensor_type = sr2.sensor_type 
            AND sr1.timestamp = sr2.max_timestamp
        `);
        return rows;
    }

    // Insert a new reading
    async insertReading(sensorType, value) {
        const [result] = await this.pool.execute(
            `INSERT INTO sensor_readings (sensor_type, value) 
             VALUES (?, ?)`,
            [sensorType, value]
        );
        return result.insertId;
    }
}

module.exports = new TelemetryDB();
