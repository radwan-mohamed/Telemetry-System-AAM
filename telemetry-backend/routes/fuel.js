// routes/fuel.js

const express = require('express');
const router = express.Router();

const db            = require('../database/connection');
const fuelProcessor = require('../logic/fuelProcessor');

// GET /api/fuel - current fuel data
router.get('/', async (req, res) => {
  try {
    const fuelReading = await db.getLatestReading('fuel_level');
    if (!fuelReading) {
      return res.status(404).json({ error: 'No fuel reading found' });
    }

    const raw        = fuelReading.value;
    const percentage = fuelProcessor.calculateFuelPercentage(raw);
    const volume     = fuelProcessor.calculateFuelVolume(raw);
    const status     = fuelProcessor.getFuelStatus(raw);
    const rangeKm    = fuelProcessor.estimateRange(raw);

    res.json({
      level:          percentage,      // %
      unit:           '%',
      volume:         volume,          // liters
      status:         status,          // e.g. "LOW"
      estimatedRange: rangeKm,         // km
      timestamp:      fuelReading.timestamp
    });
  } catch (error) {
    console.error('Error getting fuel data:', error);
    res.status(500).json({ error: 'Failed to get fuel data' });
  }
});

module.exports = router;
