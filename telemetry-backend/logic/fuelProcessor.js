// logic/fuelProcessor.js

class FuelProcessor {
  constructor() {
    // Tank capacity in liters and average consumption L/100km
    this.tankCapacity   = parseFloat(process.env.TANK_CAPACITY)   || 50;
    this.avgConsumption = parseFloat(process.env.AVG_CONSUMPTION) || 8;
  }

  // Convert raw sensor value (e.g., 0-1023) to percentage
  calculateFuelPercentage(rawValue) {
    const percentage = (rawValue / 1023) * 100;
    return Math.round(percentage * 100) / 100;
  }

  // Get fuel volume in liters based on percentage
  calculateFuelVolume(rawValue) {
    const percentage = this.calculateFuelPercentage(rawValue);
    return (percentage / 100) * this.tankCapacity;
  }

  // Determine status based on percentage thresholds
  getFuelStatus(rawValue) {
    const percentage = this.calculateFuelPercentage(rawValue);
    if (percentage < 10) return 'CRITICAL';
    if (percentage < 25) return 'LOW';
    if (percentage < 50) return 'MEDIUM';
    return 'FULL';
  }

  // Estimate range (km) based on volume and consumption
  estimateRange(rawValue) {
    const volume = this.calculateFuelVolume(rawValue);
    return Math.round((volume / this.avgConsumption) * 100);
  }
}

module.exports = new FuelProcessor();
