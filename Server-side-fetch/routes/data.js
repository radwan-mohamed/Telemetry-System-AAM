const express = require('express');
const router = express.Router();
const { SensorReading } = require('../models');

// POST /api/data
router.post('/', async (req, res) => {
  try {
    const readings = req.body;

    if (!Array.isArray(readings) || readings.length === 0) {
      return res.status(400).json({ error: 'Expected an array of readings' });
    }

    const inserted = await Promise.all(
      readings.map(r => SensorReading.create({
        sensor_type: r.sensor_type,
        value: r.value,
        timestamp: r.timestamp ? new Date(r.timestamp) : new Date()
      }))
    );

    res.status(201).json({ message: 'Inserted', count: inserted.length });
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Insert failed' });
  }
});

module.exports = router;
