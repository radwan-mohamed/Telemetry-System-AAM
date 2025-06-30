const Telemetry = require('../db/telemetryModel');

function convertTemperature(rawTemp) {
  const celsius = rawTemp;
  const fahrenheit = (celsius * 9/5) + 32;
  return { celsius, fahrenheit };
}

function calculateRPM(speed) {
  return speed * 50; // Adjust multiplier as needed
}

exports.getLatestData = async (req, res) => {
  const data = await Telemetry.getLatest();
  if (!data) return res.json({});

  const temp = convertTemperature(data.temperature);
  const rpm = calculateRPM(data.speed);

  res.json({
    timestamp: data.timestamp,
    speed: data.speed,
    temperature: {
      celsius: temp.celsius,
      fahrenheit: temp.fahrenheit
    },
    fuel_level: data.fuel_level,
    rpm
  });
};

exports.getAllData = async (req, res) => {
  const data = await Telemetry.getAll();
  res.json(data);
};

exports.getSpeed = async (req, res) => {
  const data = await Telemetry.getLatest();
  res.json({ speed: data?.speed || 0 });
};

exports.getTemperature = async (req, res) => {
  const data = await Telemetry.getLatest();
  const temp = convertTemperature(data.temperature);
  res.json(temp);
};

exports.getFuel = async (req, res) => {
  const data = await Telemetry.getLatest();
  res.json({ fuel_level: data?.fuel_level || 0 });
};

exports.getRPM = async (req, res) => {
  const data = await Telemetry.getLatest();
  const rpm = calculateRPM(data.speed);
  res.json({ rpm });
};