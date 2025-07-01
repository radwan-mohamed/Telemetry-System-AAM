// logic/temperatureProcessor.js

class TemperatureProcessor {
  /**
   * Convert various units to Celsius.
   * @param {number} value  - raw temperature value
   * @param {string} unit   - unit of the value ('celsius', 'fahrenheit', 'kelvin')
   * @returns {number} temperature in Celsius
   */
  toCelsius(value, unit = 'celsius') {
    switch (unit.toLowerCase()) {
      case 'fahrenheit':
        return (value - 32) * 5 / 9;
      case 'kelvin':
        return value - 273.15;
      default:
        return value;
    }
  }

  /**
   * Determine status based on temperature thresholds.
   * @param {number} tempC - temperature in Celsius
   * @returns {string} one of 'NORMAL', 'CAUTION', 'WARNING', 'CRITICAL'
   */
  getTemperatureStatus(tempC) {
    if (tempC > 100) return 'CRITICAL';
    if (tempC > 85)  return 'WARNING';
    if (tempC > 70)  return 'CAUTION';
    return 'NORMAL';
  }

  /**
   * Map status to a display color.
   * @param {string} status
   * @returns {string} hex color code
   */
  getTemperatureColor(status) {
    const colors = {
      NORMAL:   '#4CAF50',
      CAUTION:  '#FF9800',
      WARNING:  '#FF5722',
      CRITICAL: '#F44336'
    };
    return colors[status] || '#9E9E9E';
  }
}

module.exports = new TemperatureProcessor();
