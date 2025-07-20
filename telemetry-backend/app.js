require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/openapi.yaml');


// Middleware
app.use(cors());
//app.use(express.json());
app.use(express.static(path.join(__dirname, '../telemetry_frontend')));

// Import routes
const dataRoutes         = require('./routes/data');
const speedRoutes        = require('./routes/speed');
const temperatureRoutes  = require('./routes/temperature');
const fuelRoutes         = require('./routes/fuel');
const healthRoutes       = require('./routes/health');
const rpmRoutes          = require('./routes/rpm');
const accelRoutes        = require('./routes/acceleration');

// Use routes
app.use('/api/data', dataRoutes);
app.use('/api/speed', speedRoutes);
app.use('/api/temperature', temperatureRoutes);
app.use('/api/fuel', fuelRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/rpm', rpmRoutes);
app.use('/api/acceleration', accelRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start server
app.listen(PORT, () => {
  console.log(`Telemetry API server running on port ${PORT}`);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

});
