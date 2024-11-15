// dashboard_script.js

// Get Canvas and Context
const canvas = document.getElementById('RPMometer');
const ctx = canvas.getContext('2d');

// Get Speed Text Element
const RPMText = document.getElementById('RPM');

// Speed Variables
let currentRPM = 0; // Current speed
const maxRPM = 5000; // Maximum RPM
const animationDuration = 1000; // Animation duration in milliseconds

// Draw the RPMometer
function drawRPMometer(RPM) {
    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Parameters
    const centerX = canvas.width / 2;
    const centerY = canvas.height;
    const radius = canvas.width / 2 - 20;
    const startAngle = Math.PI;
    const endAngle = 0;

    // Draw Outer Arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Define segments
    const segments = [
        { color: '#00ff00', from: 0, to: 2000 },     // Green
        { color: '#ffff00', from: 2000, to: 4000 },  // Yellow
        { color: '#ff3b30', from: 4000, to: maxRPM } // Red
    ];

    // Draw segments
    segments.forEach(segment => {
        const start = Math.PI + (segment.from / maxRPM) * Math.PI;
        const end = Math.PI + (segment.to / maxRPM) * Math.PI;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 10, start, end, false);
        ctx.lineWidth = 20;
        ctx.strokeStyle = segment.color;
        ctx.stroke();
    });

    // Draw Ticks
    const numTicks = 10;
    for (let i = 0; i <= numTicks; i++) {
        const angle = Math.PI + (i / numTicks) * Math.PI;
        const tickStart = polarToCartesian(centerX, centerY, radius - 10, angle);
        const tickEnd = polarToCartesian(centerX, centerY, radius - 30, angle);

        ctx.beginPath();
        ctx.moveTo(tickStart.x, tickStart.y);
        ctx.lineTo(tickEnd.x, tickEnd.y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ff3b30';
        ctx.stroke();
    }

    // Draw Needle
    const needleAngle = Math.PI + (RPM / maxRPM) * Math.PI;
    const needleLength = radius - 40;
    const needleEnd = polarToCartesian(centerX, centerY, needleLength, needleAngle);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(needleEnd.x, needleEnd.y);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#00ff00'; // Green needle
    ctx.stroke();

    // Draw Center Circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Draw Labels
    ctx.font = '16px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= numTicks; i++) {
        const RPMValue = (i / numTicks) * maxRPM;
        const angle = Math.PI + (i / numTicks) * Math.PI;
        const labelPos = polarToCartesian(centerX, centerY, radius - 50, angle);
        ctx.fillText(RPMValue.toString(), labelPos.x, labelPos.y );
    }
}

// Helper Function: Convert Polar to Cartesian Coordinates
function polarToCartesian(centerX, centerY, radius, angle) {
    return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
    };
}


// Animate Speed Change
function animateRPM(targetRPM) {
    const startRPM = currentRPM;
    const changeInRPM = targetRPM - startRPM;
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        currentRPM = startRPM + changeInRPM * easeOutCubic(progress);
        drawRPMometer(currentRPM);
        RPMText.textContent = `${Math.round(currentRPM)} RPM`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

// Easing Function for Smooth Animation
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

setInterval(() => {
    const newRPM = Math.floor(Math.random() * maxRPM);
    animateRPM(newRPM);
}, 3000);
