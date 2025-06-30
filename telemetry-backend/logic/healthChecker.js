const db = require('../database/connection');

class HealthChecker {
    async performHealthCheck() {
        const checks = {
            database: await this.checkDatabase(),
            sensors: await this.checkSensors(),
            dataFreshness: await this.checkDataFreshness(),
            systemLoad: this.checkSystemLoad()
        };

        const overallStatus = this.calculateOverallHealth(checks);

        return {
            status: overallStatus,
            timestamp: new Date(),
            checks: checks,
            uptime: process.uptime()
        };
    }

    async checkDatabase() {
        try {
            await db.pool.execute('SELECT 1');
            return { status: 'OK', message: 'Database connection healthy' };
        } catch (error) {
            return { status: 'ERROR', message: 'Database connection failed' };
        }
    }

    async checkSensors() {
        try {
            const recentReadings = await db.getAllLatestReadings();
            const sensorTypes = ['rpm', 'temperature', 'fuel_level'];
            const activeSensors = recentReadings.map(r => r.sensor_type);
            
            const missingSensors = sensorTypes.filter(type => !activeSensors.includes(type));
            
            if (missingSensors.length === 0) {
                return { status: 'OK', message: 'All sensors reporting' };
            } else {
                return { 
                    status: 'WARNING', 
                    message: `Missing sensors: ${missingSensors.join(', ')}` 
                };
            }
        } catch (error) {
            return { status: 'ERROR', message: 'Sensor check failed' };
        }
    }

    async checkDataFreshness() {
        try {
            const latestReadings = await db.getAllLatestReadings();
            const now = new Date();
            const staleThreshold = 30000; // 30 seconds

            const staleReadings = latestReadings.filter(reading => {
                const readingAge = now - new Date(reading.timestamp);
                return readingAge > staleThreshold;
            });

            if (staleReadings.length === 0) {
                return { status: 'OK', message: 'All data is fresh' };
            } else {
                return { 
                    status: 'WARNING', 
                    message: `${staleReadings.length} sensors have stale data` 
                };
            }
        } catch (error) {
            return { status: 'ERROR', message: 'Data freshness check failed' };
        }
    }

    checkSystemLoad() {
        const memUsage = process.memoryUsage();
        const memUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024);
        
        if (memUsageMB > 500) {
            return { status: 'WARNING', message: `High memory usage: ${memUsageMB}MB` };
        }
        
        return { status: 'OK', message: `Memory usage: ${memUsageMB}MB` };
    }

    calculateOverallHealth(checks) {
        const statuses = Object.values(checks).map(check => check.status);
        
        if (statuses.includes('ERROR')) return 'ERROR';
        if (statuses.includes('WARNING')) return 'WARNING';
        return 'OK';
    }
}

module.exports = new HealthChecker();
