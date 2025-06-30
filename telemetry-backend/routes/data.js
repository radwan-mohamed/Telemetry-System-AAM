const express = require('express');
const router = express.Router();
const db = require('../database/connection');
const speedCalculator = require('../logic/speedCalculator');
const tempProcessor = require('../logic/temperatureProcessor');
const fuelProcessor = require('../logic/fuelProcessor');

// GET /api/data - Get all current sensor data
router.get('/', async (req, res) => {
    try {
        const allReadings = await db.getAllLatestReadings();
        
        const processedData = {
            timestamp: new Date(),
            sensors: {}
        };

        // Process each sensor type
        allReadings.forEach(reading => {
            switch (reading.sensor_type) {
                case 'rpm':
                    processedData.sensors.speed = {
                        rpm: reading.value,
                        speed: speedCalculator.rpmToSpeed(reading.value),
                        unit: 'km/h',
                        timestamp: reading.timestamp
                    };
                    break;
                    
                case 'temperature':
                    if (!processedData.sensors.temperature) {
                        processedData.sensors.temperature = [];
                    }
                    processedData.sensors.temperature.push({
                        sensorId: reading.sensor_id,
                        value: tempProcessor.toCelsius(reading.value, reading.unit),
                        status: tempProcessor.getTemperatureStatus(reading.value),
                        location: reading.location,
                        timestamp: reading.timestamp
                    });
                    break;
                    
                case 'fuel_level':
                    processedData.sensors.fuel = {
                        percentage: fuelProcessor.calculateFuelPercentage(reading.value),
                        volume: fuelProcessor.calculateFuelVolume(reading.value),
                        status: fuelProcessor.getFuelStatus(reading.value),
                        range: fuelProcessor.estimateRange(reading.value),
                        timestamp: reading.timestamp
                    };
                    break;
            }
        });

        res.json(processedData);
    } catch (error) {
        console.error('Error fetching all data:', error);
        res.status(500).json({ error: 'Failed to fetch sensor data' });
    }
});

// GET /api/data/live - Server-sent events for real-time data
router.get('/live', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
    });

    const sendData = async () => {
        try {
            const allReadings = await db.getAllLatestReadings();
            res.write(`data: ${JSON.stringify(allReadings)}\n\n`);
        } catch (error) {
            console.error('Error in live data stream:', error);
        }
    };

    // Send data every 1 second
    const interval = setInterval(sendData, 1000);

    req.on('close', () => {
        clearInterval(interval);
    });
});

module.exports = router;