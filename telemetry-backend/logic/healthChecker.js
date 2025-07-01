// logic/healthChecker.js

const db = require('../database/connection');

class HealthChecker {
  async performHealthCheck() {
    const checks = {
      database:       await this.checkDatabase(),
      sensors:        await this.checkSensors(),
      dataFreshness:  await this.checkDataFreshness(),
      systemLoad:     this.checkSystemLoad()
    };

    const overall = this.calculateOverallHealth(checks);
    return {
      status:    overall,
      timestamp: new Date(),
      checks,
      uptime:    process.uptime()
    };
  }

  async checkDatabase() {
    try {
      await db.pool.execute('SELECT 1');
      return { status: 'OK',    message: 'Database OK' };
    } catch {
      return { status: 'ERROR', message: 'DB connection failed' };
    }
  }

  async checkSensors() {
    try {
      const readings     = await db.getAllLatestReadings();
      const types        = ['rpm', 'temperature', 'fuel_level'];
      const present      = readings.map(r => r.sensor_type);
      const missing      = types.filter(t => !present.includes(t));

      if (!missing.length) {
        return { status: 'OK', message: 'All sensors reporting' };
      }
      return { status: 'WARNING', message: `Missing sensors: ${missing.join(', ')}` };
    } catch {
      return { status: 'ERROR',   message: 'Sensor check failed' };
    }
  }

  async checkDataFreshness() {
    try {
      const readings       = await db.getAllLatestReadings();
      const now            = Date.now();
      const staleThreshold = parseInt(process.env.STALE_MS, 10) || 30000;
      const staleCount     = readings.filter(r => (now - new Date(r.timestamp)) > staleThreshold).length;

      if (!staleCount) {
        return { status: 'OK',      message: 'Data fresh' };
      }
      return { status: 'WARNING', message: `${staleCount} stale readings` };
    } catch {
      return { status: 'ERROR',   message: 'Freshness check failed' };
    }
  }

  checkSystemLoad() {
    const memMB = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    if (memMB > 500) {
      return { status: 'WARNING', message: `High memory usage: ${memMB}MB` };
    }
    return { status: 'OK',      message: `Memory usage: ${memMB}MB` };
  }

  calculateOverallHealth(checks) {
    const statuses = Object.values(checks).map(c => c.status);
    if (statuses.includes('ERROR'))   return 'ERROR';
    if (statuses.includes('WARNING')) return 'WARNING';
    return 'OK';
  }
}

module.exports = new HealthChecker();
