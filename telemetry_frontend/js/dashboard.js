// Dashboard Animation Script for Telemetry Gauges

const maxValues = {
  speed: 200,
  rpm: 7000,
  temperature: 120,
  fuel: 100,
  throttle: 100,
  brake: 100,
  oilPressure: 100,
  coolantTemp: 120,
  iat: 100
};

const lowFuelThreshold = 5;
const gears = ['N', '1', '2', '3', '4', '5', '6'];

function polarToCartesian(cx, cy, radius, angle) {
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle)
  };
}

function drawGauge(canvasId, value, maxValue, unit, numTicks = 20) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  const radius = canvas.width / 2 - 20;
  const centerX = canvas.width / 2;
  const centerY = canvas.height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const thresholds = [0.4, 0.75, 1];
  const colors = ['#00ff00', '#ffff00', '#ff3b30'];
  const startAngles = [Math.PI, Math.PI + Math.PI * thresholds[0], Math.PI + Math.PI * thresholds[1]];
  const endAngles = [Math.PI + Math.PI * thresholds[0], Math.PI + Math.PI * thresholds[1], 2 * Math.PI];

  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 10, startAngles[i], endAngles[i]);
    ctx.lineWidth = 5;
    ctx.strokeStyle = colors[i];
    ctx.stroke();
  }

  ctx.font = '10px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i <= numTicks; i++) {
    const tickValue = (i / numTicks) * maxValue;
    const angle = Math.PI + (i / numTicks) * Math.PI;
    const tickStart = polarToCartesian(centerX, centerY, radius - 10, angle);
    const tickEnd = polarToCartesian(centerX, centerY, radius - 20, angle);
    const labelPos = polarToCartesian(centerX, centerY, radius - 35, angle);

    ctx.beginPath();
    ctx.moveTo(tickStart.x, tickStart.y);
    ctx.lineTo(tickEnd.x, tickEnd.y);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    if (i % 2 === 0) ctx.fillText(Math.round(tickValue), labelPos.x, labelPos.y);
  }

  const angle = Math.PI + (value / maxValue) * Math.PI;
  const needleEnd = polarToCartesian(centerX, centerY, radius - 40, angle);
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(needleEnd.x, needleEnd.y);
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#ff3b30';
  ctx.stroke();

  ctx.font = 'bold 20px Arial';
  ctx.fillStyle = '#ff3b30';
  ctx.fillText(`${Math.round(value)} ${unit}`, centerX, centerY - radius - 30);
}

const gaugeValues = {
  speed: 0,
  rpm: 0,
  temperature: 0,
  fuel: 100,
  throttle: 0,
  brake: 0,
  oilPressure: 0,
  coolantTemp: 0,
  iat: 0
};

// Fetch latest telemetry data from backend
async function fetchTelemetryData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();

    gaugeValues.speed = data.speed || 0;
    gaugeValues.rpm = data.rpm || 0;
    gaugeValues.temperature = data.temperature || 0;
    gaugeValues.fuel = data.fuel || 0;
    gaugeValues.throttle = data.throttle || 0;
    gaugeValues.brake = data.brake || 0;
    gaugeValues.oilPressure = data.oilPressure || 0;
    gaugeValues.coolantTemp = data.coolantTemp || 0;
    gaugeValues.iat = data.iat || 0;
  } catch (error) {
    console.error('Failed to fetch telemetry data:', error);
  }
}

async function updateDashboard() {
  await fetchTelemetryData();

  for (let key in gaugeValues) {
    if (document.getElementById(key)) {
      const unit = key === 'temperature' || key === 'coolantTemp' || key === 'iat' ? '°C'
                  : key === 'fuel' || key === 'throttle' || key === 'brake' ? '%'
                  : key === 'rpm' ? 'RPM'
                  : key === 'oilPressure' ? 'PSI'
                  : 'KPH';
      drawGauge(key, gaugeValues[key], maxValues[key], unit);
      const valEl = document.getElementById('val-' + key);
      if (valEl) valEl.innerText = `${Math.round(gaugeValues[key])} ${unit}`;
    }
  }

  // Simulated gear display (you can connect real data here too)
  const randomGear = gears[Math.floor(Math.random() * gears.length)];
  document.getElementById('gearDisplay').innerText = randomGear;

  requestAnimationFrame(updateDashboard);
}

updateDashboard();
