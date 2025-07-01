// logic/speedCalculator.js

class SpeedCalculator {
  constructor() {
    // Formula Student car specifications
    this.wheelRadius = parseFloat(process.env.WHEEL_RADIUS) || 0.25; // meters
    this.gearRatio   = parseFloat(process.env.GEAR_RATIO)   || 3.5;
  }

  /**
   * Convert RPM to speed in km/h.
   * Speed (m/s) = (RPM * wheel circumference) / (60 * gear ratio)
   * Then converted to km/h by multiplying by 3.6.
   * @param {number} rpm
   * @returns {number} speed in km/h (rounded to 2 decimals)
   */
  rpmToSpeed(rpm) {
    const wheelCirc = 2 * Math.PI * this.wheelRadius;
    const speedMs   = (rpm * wheelCirc) / (60 * this.gearRatio);
    const speedKmh  = speedMs * 3.6;
    return Math.round(speedKmh * 100) / 100;
  }

  /**
   * Validate an RPM reading.
   * @param {number} rpm
   * @returns {boolean}
   */
  validateRPM(rpm) {
    return typeof rpm === 'number' && rpm >= 0 && rpm <= 15000;
  }
}

module.exports = new SpeedCalculator();
