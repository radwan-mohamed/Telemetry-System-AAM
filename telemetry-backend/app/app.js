const express = require('express');
const path = require('path');
const telemetryRoutes = require('../visualization/visualization');

const app = express();

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../visualization/public')));
app.use('/api', telemetryRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});