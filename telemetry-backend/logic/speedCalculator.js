class SpeedCalculator {
    constructor() {
        // Formula Student car specifications
        this.wheelRadius = 0.25; // meters (adjust based on your car)
        this.gearRatio = 3.5;    // adjust based on your transmission
    }

    rpmToSpeed(rpm) {
        // Convert RPM to speed in km/h
        // Speed = (RPM * wheel circumference * 60) / (gear ratio * 1000)
        const wheelCircumference = 2 * Math.PI * this.wheelRadius;
        const speedMs = (rpm * wheelCircumference * 60) / (this.gearRatio * 1000);
        const speedKmh = speedMs * 3.6;
        
        return Math.round(speedKmh * 100) / 100; // Round to 2 decimal places
    }

    validateRPM(rpm) {
        // Validate RPM reading (adjust limits for your engine)
        return rpm >= 0 && rpm <= 15000;
    }
}

module.exports = new SpeedCalculator();
