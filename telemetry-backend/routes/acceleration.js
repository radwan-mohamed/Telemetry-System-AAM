// routes/acceleration.js

const express = require('express');
const router  = express.Router();

const db              = require('../database/connection');
const speedCalculator = require('../logic/speedCalculator');
const accelCalculator = require('../logic/acceleration');

router.get('/', async (req, res) => {
  try {
    console.log('🔍 [Accel] Fetching last 2 RPM readings…');
    const rpmHistory = await db.getReadingHistory('rpm', 2);
    console.log('🔍 [Accel] rpmHistory =', rpmHistory);

    if (rpmHistory.length < 2) {
      console.log(`⚠️ [Accel] Only ${rpmHistory.length} reading(s) found`);
      return res
        .status(404)
        .json({ error: 'Not enough RPM data to compute acceleration' });
    }

    const [latest, previous] = rpmHistory;
    const speedLatest = speedCalculator.rpmToSpeed(latest.value);
    const speedPrev   = speedCalculator.rpmToSpeed(previous.value);

    const t1 = new Date(latest.timestamp);
    const t0 = new Date(previous.timestamp);
    const deltaSec = (t1 - t0) / 1000;
    console.log(`🔍 [Accel] Δt=${deltaSec}s, v0=${speedPrev} km/h, v1=${speedLatest} km/h`);

    const acceleration = accelCalculator.computeAcceleration(speedPrev, speedLatest, deltaSec);
    console.log('🔍 [Accel] acceleration =', acceleration);

    res.json({
      acceleration,
      unit: 'm/s²',
      from: previous.timestamp,
      to:   latest.timestamp
    });
  } catch (err) {
    console.error('❌ [Accel] Error in route:', err);
    res.status(500).json({ error: 'Failed to get acceleration data' });
  }
});

module.exports = router;
