const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const dataRoutes = require('./routes/data');
const speedRoutes = require('./routes/speed');
const temperatureRoutes = require('./routes/temperature');
const fuelRoutes = require('./routes/fuel');
const healthRoutes = require('./routes/health');

// Use routes
app.use('/api/data', dataRoutes);
app.use('/api/speed', speedRoutes);
app.use('/api/temperature', temperatureRoutes);
app.use('/api/fuel', fuelRoutes);
app.use('/api/health', healthRoutes);

app.listen(PORT, () => {
    console.log(`Telemetry API server running on port ${PORT}`);
});
