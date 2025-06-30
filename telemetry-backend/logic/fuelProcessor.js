class FuelProcessor {
    constructor() {
        this.tankCapacity = 50; // Liters (adjust for your car)
        this.avgConsumption = 8; // L/100km (adjust based on your car)
    }

    calculateFuelPercentage(rawValue) {
        // Convert sensor reading to percentage (0-100%)
        // Assuming rawValue is voltage or resistance from fuel sensor
        const percentage = (rawValue / 1023) * 100; // Adjust based on your sensor
        return Math.round(percentage * 100) / 100;
    }

    calculateFuelVolume(rawValue) {
        const percentage = this.calculateFuelPercentage(rawValue);
        return (percentage / 100) * this.tankCapacity;
    }

    getFuelStatus(rawValue) {
        const percentage = this.calculateFuelPercentage(rawValue);
        if (percentage < 10) return 'CRITICAL';
        if (percentage < 25) return 'LOW';
        if (percentage < 50) return 'MEDIUM';
        return 'FULL';
    }

    estimateRange(rawValue) {
        const volume = this.calculateFuelVolume(rawValue);
        return Math.round((volume / this.avgConsumption) * 100); // Range in km
    }
}

module.exports = new FuelProcessor();
