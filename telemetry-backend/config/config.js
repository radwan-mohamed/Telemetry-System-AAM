require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER     || 'merlet',
    password: process.env.DB_PASSWORD || 'IzysQ4141',
    database: process.env.DB_NAME     || 'merlet_telemetry',
    host:     process.env.DB_HOST     || 'mysql-merlet.alwaysdata.net',
    port:     parseInt(process.env.DB_PORT) || 3306,
    dialect:  'mysql'
  }
};
