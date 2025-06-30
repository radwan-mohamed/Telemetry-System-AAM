const express = require('express');
const router = express.Router();
const controller = require('../logic/telemetryController');

router.get('/latest', controller.getLatestData);
router.get('/all', controller.getAllData);
router.get('/speed', controller.getSpeed);
router.get('/temperature', controller.getTemperature);
router.get('/fuel', controller.getFuel);
router.get('/rpm', controller.getRPM);

module.exports = router;