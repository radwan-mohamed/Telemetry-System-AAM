const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, 'telemetry.db'));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS telemetry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT (datetime('now')),
      speed REAL,
      temperature REAL,
      fuel_level REAL
    )
  `);
});

module.exports = db;