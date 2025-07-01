// routes/health.js

const express = require('express');
const router  = express.Router();

// GET /api/health - simple server health check
router.get('/', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

module.exports = router;
