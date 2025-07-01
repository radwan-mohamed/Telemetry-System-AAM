// routes/data.js

const express = require('express');
const router = express.Router();

const db               = require('../database/connection');
const speedCalculator  = require('../logic/speedCalculator');
const tempProcessor    = require('../logic/temperatureProcessor');
const fuelProcessor    = require('../logic/fuelProcessor');

// GET /api/data - Get all current sensor data
router.get('/', async (req, res) => {
  try {
    const allReadings = await db.getAllLatestReadings();
    const processedData = {
      timestamp: new Date(),
      sensors: {}
    };

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
          const tempC = tempProcessor.toCelsius(reading.value, reading.unit);
          processedData.sensors.temperature.push({
            sensorId: reading.sensor_id,
            value: tempC,
            status: tempProcessor.getTemperatureStatus(tempC),
            color: tempProcessor.getTemperatureColor(tempProcessor.getTemperatureStatus(tempC)),
            location: reading.location,
            timestamp: reading.timestamp
          });
          break;

        case 'fuel_level':
          const pct = fuelProcessor.calculateFuelPercentage(reading.value);
          processedData.sensors.fuel = {
            percentage: pct,
            volume: fuelProcessor.calculateFuelVolume(reading.value),
            status: fuelProcessor.getFuelStatus(reading.value),
            estimatedRange: fuelProcessor.estimateRange(reading.value),
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

module.exports = router;
