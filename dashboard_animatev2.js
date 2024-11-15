const maxValues = {
    speed: 60,
    rpm: 7000,
    temperature: 120, // Celsius
    fuel: 100 // Percentage
};

// Helper function to convert polar coordinates to Cartesian
function polarToCartesian(centerX, centerY, radius, angle) {
    return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
    };
}

// Enhanced drawGauge function with smaller font sizes for tick labels and current value
function drawGauge(canvasId, value, maxValue, unit, segments, numTicks = 10) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2 - 20;
    const centerX = canvas.width / 2;
    const centerY = canvas.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Color-Coded Segments
    segments.forEach(segment => {
        const start = Math.PI + (segment.from / maxValue) * Math.PI;
        const end = Math.PI + (segment.to / maxValue) * Math.PI;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 10, start, end, false);
        ctx.lineWidth = 20;
        ctx.strokeStyle = segment.color;
        ctx.stroke();
    });

    // Draw Numeric Grid (Tick Marks and Labels)
    ctx.font = '10px Arial'; // Reduced font size for tick labels
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= numTicks; i++) {
        const tickValue = (i / numTicks) * maxValue;
        const angle = Math.PI + (i / numTicks) * Math.PI;
        const tickStart = polarToCartesian(centerX, centerY, radius - 10, angle);
        const tickEnd = polarToCartesian(centerX, centerY, radius - 30, angle);
        const labelPos = polarToCartesian(centerX, centerY, radius - 50, angle);

        // Draw Tick Line
        ctx.beginPath();
        ctx.moveTo(tickStart.x, tickStart.y);
        ctx.lineTo(tickEnd.x, tickEnd.y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Draw Numeric Label
        ctx.fillText(Math.round(tickValue).toString(), labelPos.x, labelPos.y);
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

    // Display Current Value Prominently in the Center of the Gauge
    ctx.font = '14px Arial'; // Reduced font size for current value
    ctx.fillStyle = '#ff3b30';
    ctx.fillText(`${Math.round(value)} ${unit}`, centerX, centerY - 20);
}

// Define Color-Coded Segments for Gauges
const gaugeSegments = {
    speed: [
        { color: '#00ff00', from: 0, to: 20 },  // Green for 0-20 mph
        { color: '#ffff00', from: 20, to: 40 }, // Yellow for 20-40 mph
        { color: '#ff3b30', from: 40, to: 60 }  // Red for 40-60 mph
    ],
    rpm: [
        { color: '#00ff00', from: 0, to: 2000 },
        { color: '#ffff00', from: 2000, to: 4000 },
        { color: '#ff3b30', from: 4000, to: 7000 }
    ],
    temperature: [
        { color: '#00ff00', from: 0, to: 50 },
        { color: '#ffff00', from: 50, to: 90 },
        { color: '#ff3b30', from: 90, to: 120 }
    ],
    fuel: [
        { color: '#ff3b30', from: 0, to: 20 },
        { color: '#ffff00', from: 20, to: 50 },
        { color: '#00ff00', from: 50, to: 100 }
    ]
};

// Update function to simulate data and refresh the gauges
function updateDashboard() {
    const currentSpeed = Math.random() * maxValues.speed;
    const currentRPM = Math.random() * maxValues.rpm;
    const currentTemp = Math.random() * maxValues.temperature;
    const currentFuel = Math.random() * maxValues.fuel;

    // Draw each gauge with color-coded segments and tick marks
    drawGauge('speedometer', currentSpeed, maxValues.speed, 'mph', gaugeSegments.speed);
    drawGauge('rpm', currentRPM, maxValues.rpm, 'RPM', gaugeSegments.rpm);
    drawGauge('temperature', currentTemp, maxValues.temperature, '°C', gaugeSegments.temperature);
    drawGauge('fuel', currentFuel, maxValues.fuel, '%', gaugeSegments.fuel);
}

// Update gauges every second
setInterval(updateDashboard, 1000);
