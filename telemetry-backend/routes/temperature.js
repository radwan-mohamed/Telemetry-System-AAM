// routes/temperature.js

const express = require('express');
const router = express.Router();

const db = require('../database/connection');
const tempProcessor = require('../logic/temperatureProcessor');

// GET /api/temperature - Get current temperature readings
router.get('/', async (req, res) => {
  try {
    const tempSensors = await db.getLatestReadings('temperature');
    const processedTemps = tempSensors.map(r => {
      const tempC = tempProcessor.toCelsius(r.value, r.unit);
      const status = tempProcessor.getTemperatureStatus(tempC);
      return {
        sensorId: r.sensor_id,
        temperature: tempC,
        status: status,
        color: tempProcessor.getTemperatureColor(status),
        location: r.location,
        timestamp: r.timestamp
      };
    });
    res.json(processedTemps);
  } catch (error) {
    console.error('Error getting temperature data:', error);
    res.status(500).json({ error: 'Failed to get temperature data' });
  }
});

module.exports = router;