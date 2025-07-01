// routes/speed.js

const express = require('express');
const router = express.Router();

const speedCalculator = require('../logic/speedCalculator');
const db = require('../database/connection');

// GET /api/speed - Get current vehicle speed
router.get('/', async (req, res) => {
  try {
    const latestRPM = await db.getLatestReading('rpm');
    if (!latestRPM) {
      return res.status(404).json({ error: 'No RPM reading found' });
    }
    const speed = speedCalculator.rpmToSpeed(latestRPM.value);
    res.json({
      rpm: latestRPM.value,
      speed: speed,
      unit: 'km/h',
      timestamp: latestRPM.timestamp
    });
  } catch (error) {
    console.error('Error getting speed:', error);
    res.status(500).json({ error: 'Failed to get speed data' });
  }
});

// GET /api/speed/history - Get speed history
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 100;
    const rpmHistory = await db.getReadingHistory('rpm', limit);
    const speedHistory = rpmHistory.map(r => ({
      rpm: r.value,
      speed: speedCalculator.rpmToSpeed(r.value),
      unit: 'km/h',
      timestamp: r.timestamp
    }));
    res.json(speedHistory);
  } catch (error) {
    console.error('Error getting speed history:', error);
    res.status(500).json({ error: 'Failed to get speed history' });
  }
});

module.exports = router;