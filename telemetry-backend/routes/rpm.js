// routes/rpm.js

const express = require('express');
const router = express.Router();

const db = require('../database/connection');

// GET /api/rpm - latest raw RPM reading
router.get('/', async (req, res) => {
try {
    console.log('🔍 [RPM] querying latest RPM…');
    const latest = await db.getLatestReading('rpm');
    console.log('🔍 [RPM] db.getLatestReading returned →', latest);
    if (!latest) {
      return res.status(404).json({ error: 'No RPM reading found' });
    }
    res.json({
      rpm:       latest.value,
      unit:      'rpm',
      timestamp: latest.timestamp
    });
  } catch (error) {
    console.error('Error getting RPM:', error);
    res.status(500).json({ error: 'Failed to get RPM data' });
  }
});

module.exports = router;
