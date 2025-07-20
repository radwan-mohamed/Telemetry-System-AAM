const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const processedData = {
      timestamp: new Date(),
      sensors: {
        speed: {
          rpm: Math.floor(Math.random() * 7000),
          speed: Math.floor(Math.random() * 200),
          unit: 'km/h',
          timestamp: new Date()
        },
        temperature: [
          {
            sensorId: 'temp-01',
            value: Math.floor(Math.random() * 120),
            status: 'Normal',
            color: '#00ff00',
            location: 'engine',
            timestamp: new Date()
          }
        ],
        fuel: {
          percentage: Math.floor(Math.random() * 100),
          volume: 20,
          status: 'Normal',
          estimatedRange: 150,
          timestamp: new Date()
        }
      }
    };

    res.json(processedData);
  } catch (error) {
    console.error('Error fetching mock data:', error);
    res.status(500).json({ error: 'Mock data fetch failed' });
  }
});

module.exports = router;
