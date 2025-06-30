const express = require('express');
const router = express.Router();
const speedCalculator = require('../logic/speedCalculator');
const db = require('../database/connection');

// GET /api/speed - Get current vehicle speed
router.get('/', async (req, res) => {
    try {
        // Get latest RPM reading from database
        const latestRPM = await db.getLatestReading('rpm');
        
        // Convert RPM to speed using logic layer
        const speed = speedCalculator.rpmToSpeed(latestRPM.value);
        
        res.json({
            speed: speed,
            unit: 'km/h',
            timestamp: new Date(),
            rpm: latestRPM.value
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get speed data' });
    }
});

// GET /api/speed/history - Get speed history
router.get('/history', async (req, res) => {
    try {
        const { limit = 100 } = req.query;
        const rpmHistory = await db.getReadingHistory('rpm', limit);
        
        const speedHistory = rpmHistory.map(reading => ({
            speed: speedCalculator.rpmToSpeed(reading.value),
            timestamp: reading.timestamp,
            rpm: reading.value
        }));
        
        res.json(speedHistory);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get speed history' });
    }
});

module.exports = router;
