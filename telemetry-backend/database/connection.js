const mysql = require('mysql2/promise'); // or your preferred DB

class TelemetryDB {
    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'telemetry_user',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_NAME || 'formula_telemetry',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    async getLatestReading(sensorType) {
        const [rows] = await this.pool.execute(
            'SELECT * FROM sensor_readings WHERE sensor_type = ? ORDER BY timestamp DESC LIMIT 1',
            [sensorType]
        );
        return rows[0];
    }

    async getLatestReadings(sensorType) {
        const [rows] = await this.pool.execute(
            'SELECT * FROM sensor_readings WHERE sensor_type = ? ORDER BY timestamp DESC LIMIT 10',
            [sensorType]
        );
        return rows;
    }

    async getReadingHistory(sensorType, limit = 100) {
        const [rows] = await this.pool.execute(
            'SELECT * FROM sensor_readings WHERE sensor_type = ? ORDER BY timestamp DESC LIMIT ?',
            [sensorType, limit]
        );
        return rows;
    }

    async getAllLatestReadings() {
        const [rows] = await this.pool.execute(`
            SELECT sr1.* FROM sensor_readings sr1
            INNER JOIN (
                SELECT sensor_type, MAX(timestamp) as max_timestamp
                FROM sensor_readings
                GROUP BY sensor_type
            ) sr2 ON sr1.sensor_type = sr2.sensor_type AND sr1.timestamp = sr2.max_timestamp
        `);
        return rows;
    }
}

module.exports = new TelemetryDB();

