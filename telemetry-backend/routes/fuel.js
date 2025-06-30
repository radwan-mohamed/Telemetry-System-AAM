const express = require('express');
const router = express.Router();
const fuelProcessor = require('../logic/fuelProcessor');
const db = require('../database/connection');

router.get('/', async (req, res) => {
    try {
        const fuelReading = await db.getLatestReading('fuel_level');
        
        const fuelData = {
            level: fuelProcessor.calculateFuelPercentage(fuelReading.value),
            volume: fuelProcessor.calculateFuelVolume(fuelReading.value),
            status: fuelProcessor.getFuelStatus(fuelReading.value),
            estimatedRange: fuelProcessor.estimateRange(fuelReading.value),
            timestamp: fuelReading.timestamp
        };
        
        res.json(fuelData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get fuel data' });
    }
});

module.exports = router;