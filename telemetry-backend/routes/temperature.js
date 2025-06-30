const express = require('express');
const router = express.Router();
const tempProcessor = require('../logic/temperatureProcessor');
const db = require('../database/connection');

router.get('/', async (req, res) => {
    try {
        const tempSensors = await db.getLatestReadings('temperature');
        
        const processedTemps = tempSensors.map(sensor => ({
            sensorId: sensor.sensor_id,
            temperature: tempProcessor.toCelsius(sensor.value, sensor.unit),
            location: sensor.location, // engine, brakes, etc.
            status: tempProcessor.getTemperatureStatus(sensor.value),
            timestamp: sensor.timestamp
        }));
        
        res.json(processedTemps);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get temperature data' });
    }
});

module.exports = router;