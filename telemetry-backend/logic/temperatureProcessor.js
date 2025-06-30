class TemperatureProcessor {
    toCelsius(value, unit = 'celsius') {
        switch (unit.toLowerCase()) {
            case 'fahrenheit':
                return (value - 32) * 5/9;
            case 'kelvin':
                return value - 273.15;
            default:
                return value; // Already in Celsius
        }
    }

    getTemperatureStatus(tempCelsius) {
        // Define temperature thresholds for Formula Student car
        if (tempCelsius > 100) return 'CRITICAL';
        if (tempCelsius > 85) return 'WARNING';
        if (tempCelsius > 70) return 'CAUTION';
        return 'NORMAL';
    }

    getTemperatureColor(status) {
        const colors = {
            'NORMAL': '#4CAF50',
            'CAUTION': '#FF9800', 
            'WARNING': '#FF5722',
            'CRITICAL': '#F44336'
        };
        return colors[status] || '#9E9E9E';
    }
}

module.exports = new TemperatureProcessor();
