require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const dataRoutes = require('./routes/data');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/openapi.yaml');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/data', dataRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// DB connection + start server
sequelize.authenticate().then(() => {
  console.log('✅ DB connected');
  app.listen(PORT, () => console.log(`🚀 Data server running on port ${PORT}`));
}).catch(err => {
  console.error('❌ DB connection failed:', err);
});
