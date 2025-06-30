// Format dashboard dataclass DashboardDataFormatter {
class DashboardDataFormatter {   
formatForGauges(sensorData) {
        return {
            speed: {
                value: sensorData.sensors.speed?.speed || 0,
                max: 200, // km/h
                unit: 'km/h',
                color: this.getSpeedColor(sensorData.sensors.speed?.speed || 0)
            },
            rpm: {
                value: sensorData.sensors.speed?.rpm || 0,
                max: 8000,
                unit: 'RPM',
                color: this.getRPMColor(sensorData.sensors.speed?.rpm || 0)
            },
            fuel: {
                value: sensorData.sensors.fuel?.percentage || 0,
                max: 100,
                unit: '%',
                color: this.getFuelColor(sensorData.sensors.fuel?.percentage || 0)
            },
            temperature: {
                value: this.getMaxTemperature(sensorData.sensors.temperature || []),
                max: 120,
                unit: '°C',
                color: this.getTempColor(this.getMaxTemperature(sensorData.sensors.temperature || []))
            }
        };
    }

    getSpeedColor(speed) {
        if (speed > 150) return '#FF5722'; // Red - dangerous speed
        if (speed > 100) return '#FF9800'; // Orange - high speed
        if (speed > 50) return '#4CAF50';  // Green - normal speed
        return '#2196F3'; // Blue - low speed
    }

    getRPMColor(rpm) {
        if (rpm > 7000) return '#FF5722'; // Red zone
        if (rpm > 5000) return '#FF9800'; // Orange zone
        return '#4CAF50'; // Green zone
    }

    getFuelColor(percentage) {
        if (percentage < 10) return '#FF5722'; // Critical
        if (percentage < 25) return '#FF9800'; // Low
        return '#4CAF50'; // Good
    }

    getTempColor(temp) {
        if (temp > 100) return '#FF5722'; // Critical
        if (temp > 85) return '#FF9800';  // Warning
        if (temp > 70) return '#FFC107';  // Caution
        return '#4CAF50'; // Normal
    }

    getMaxTemperature(tempArray) {
        if (!tempArray.length) return 0;
        return Math.max(...tempArray.map(t => t.value));
    }

    formatForCharts(historicalData, timeRange = '1h') {
        // Format data for time-series charts
        const chartData = {
            speed: [],
            temperature: [],
            fuel: [],
            rpm: []
        };

        historicalData.forEach(reading => {
            const timestamp = new Date(reading.timestamp);
            
            switch (reading.sensor_type) {
                case 'rpm':
                    chartData.speed.push({
                        x: timestamp,
                        y: speedCalculator.rpmToSpeed(reading.value)
                    });
                    chartData.rpm.push({
                        x: timestamp,
                        y: reading.value
                    });
                    break;
                case 'temperature':
                    chartData.temperature.push({
                        x: timestamp,
                        y: reading.value
                    });
                    break;
                case 'fuel_level':
                    chartData.fuel.push({
                        x: timestamp,
                        y: fuelProcessor.calculateFuelPercentage(reading.value)
                    });
                    break;
            }
        });

        return chartData;
    }
}

module.exports = new DashboardDataFormatter();
