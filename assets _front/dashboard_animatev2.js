const maxValues = {
    speed: 200,
    rpm: 7000,
    temperature: 120, // Celsius
    fuel: 100 // Percentage
};

// Constants for fuel consumption
const fuelConsumptionRate = 0.1; // Decrease per update (e.g., 0.1% per frame)
const lowFuelThreshold = 5; // Refuel when below this threshold

// Helper function to convert polar coordinates to Cartesian
function polarToCartesian(centerX, centerY, radius, angle) {
    return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
    };
}

// Function to smoothly animate a value toward a target
function animateValue(currentValue, targetValue, step = 2) {
    if (Math.abs(currentValue - targetValue) < step) {
        return targetValue; // Stop when close enough to target
    }
    return currentValue + (currentValue < targetValue ? step : -step);
}

// Enhanced drawGauge function with smoother transitions and clearer displayed values
function drawGauge(canvasId, value, maxValue, unit, segments, numTicks = 20) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2 - 20;
    const centerX = canvas.width / 2;
    const centerY = canvas.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Determine line width based on the gauge type
    const lineWidth = 5;

    // Draw Color-Coded Segments
    if (segments.length > 0) {
        segments.forEach(segment => {
            const start = Math.PI + (segment.from / maxValue) * Math.PI;
            const end = Math.PI + (segment.to / maxValue) * Math.PI;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius - 10, start, end, false);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = segment.color;
            ctx.stroke();
        });
    } else {
        // Draw a single neutral arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 10, Math.PI, 2 * Math.PI, false);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
    }

    // Draw Numeric Grid (Tick Marks and Labels)
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

        // Draw Tick Line
        ctx.beginPath();
        ctx.moveTo(tickStart.x, tickStart.y);
        ctx.lineTo(tickEnd.x, tickEnd.y);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Draw Numeric Label for Major Ticks
        if (i % 2 === 0) {
            ctx.fillText(Math.round(tickValue).toString(), labelPos.x, labelPos.y);
        }
    }

    // Draw Needle
    const needleAngle = Math.PI + (value / maxValue) * Math.PI;
    const needleLength = radius - 40;
    const needleEnd = polarToCartesian(centerX, centerY, needleLength, needleAngle);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(needleEnd.x, needleEnd.y);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ff3b30';
    ctx.stroke();

    // Display Current Value Prominently at the Top of the Gauge
    const displayY = centerY - radius - 30; // Position above the arc
    ctx.font = 'bold 20px Arial'; // Larger and bolder font for clarity
    ctx.fillStyle = '#ff3b30';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(value)} ${unit}`, centerX, displayY);
}

// Define Gauge Segments
const gaugeSegments = {
    speed: [
        { color: '#00ff00', from: 0, to: 80 },
        { color: '#ffff00', from: 80, to: 140 },
        { color: '#ff3b30', from: 140, to: 200 }
    ],
    rpm: [
        { color: '#00ff00', from: 0, to: 2000 },
        { color: '#ffff00', from: 2000, to: 4000 },
        { color: '#ff3b30', from: 4000, to: 7000 }
    ],
    temperature: [], // No color coding for temperature
    fuel: [] // No color coding for fuel
};

// Initial values for the gauges
const gaugeValues = {
    speed: 0,
    rpm: 0,
    temperature: 0,
    fuel: 100 // Start with full fuel
};

// Update function to simulate data and refresh the gauges with smooth transitions
function updateDashboard() {
    const targetSpeed = Math.random() * maxValues.speed;
    const targetRPM = Math.random() * maxValues.rpm;
    const targetTemp = Math.random() * maxValues.temperature;

    // Simulate fuel consumption
    gaugeValues.fuel -= fuelConsumptionRate;
    if (gaugeValues.fuel < lowFuelThreshold) {
        gaugeValues.fuel = maxValues.fuel; // Simulate refueling
    }

    gaugeValues.speed = animateValue(gaugeValues.speed, targetSpeed);
    gaugeValues.rpm = animateValue(gaugeValues.rpm, targetRPM);
    gaugeValues.temperature = animateValue(gaugeValues.temperature, targetTemp);

    drawGauge('speedometer', gaugeValues.speed, maxValues.speed, 'KPH', gaugeSegments.speed);
    drawGauge('rpm', gaugeValues.rpm, maxValues.rpm, 'RPM', gaugeSegments.rpm);
    drawGauge('temperature', gaugeValues.temperature, maxValues.temperature, '°C', gaugeSegments.temperature);
    drawGauge('fuel', gaugeValues.fuel, maxValues.fuel, '%', gaugeSegments.fuel);

    requestAnimationFrame(updateDashboard); // Smooth animation loop
}

// Start the dashboard update loop
updateDashboard();
