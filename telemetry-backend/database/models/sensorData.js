const db = require('../connection');

exports.getLatestData = () => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM telemetry ORDER BY timestamp DESC LIMIT 1`, (err, row) =>
            err ? reject(err) : resolve(row)
        );
    });
};

exports.getAllData = () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM telemetry ORDER BY timestamp DESC`, (err, rows) =>
            err ? reject(err) : resolve(rows)
        );
    });
};