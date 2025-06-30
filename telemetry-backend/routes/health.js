const express = require('express');
const router = express.Router();
const healthChecker = require('../logic/healthChecker');

router.get('/', async (req, res) => {
    try {
        const healthStatus = await healthChecker.performHealthCheck();
        res.json(healthStatus);
    } catch (error) {
        res.status(500).json({ error: 'Health check failed' });
    }
});

module.exports = router;
