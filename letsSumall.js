// Temperature.js

const currentTempElem = document.getElementById('temperature-value');
const maxTempElem = document.getElementById('maxTemp');
const minTempElem = document.getElementById('minTemp');
const avgTempElem = document.getElementById('avgTemp');
const tempFillElem = document.getElementById('temperature-fill');
const tempGraph = document.getElementById('temperature-graph').getContext('2d');

let temperatures = [21.6, 21.8, 22.0, 22.3, 21.9, 22.1, 21.7, 22.5, 21.2];
let maxTemp = Math.max(...temperatures);
let minTemp = Math.min(...temperatures);
let avgTemp = (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1);

// Update temperature display
function updateTemperatureDisplay() {
  const currentTemp = temperatures[temperatures.length - 1];
  currentTempElem.innerText = `${currentTemp}°C`;
  maxTempElem.innerText = `${maxTemp}°C`;
  minTempElem.innerText = `${minTemp}°C`;
  avgTempElem.innerText = `${avgTemp}°C`;

  // Update the fill width based on the current temperature
  let fillPercent = ((currentTemp - minTemp) / (maxTemp - minTemp)) * 100;
  tempFillElem.style.width = `${fillPercent}%`;
}

// Draw temperature graph
function drawTemperatureGraph() {
  tempGraph.clearRect(0, 0, 300, 100);

  tempGraph.beginPath();
  tempGraph.moveTo(0, 100 - (temperatures[0] - minTemp) * 10);

  temperatures.forEach((temp, i) => {
    let y = 100 - (temp - minTemp) * 10;
    let x = (i / (temperatures.length - 1)) * 300;
    tempGraph.lineTo(x, y);
  });

  tempGraph.strokeStyle = "#76ff76";
  tempGraph.lineWidth = 2;
  tempGraph.stroke();
}

// Function to generate random temperature values over time
function generateRandomTemperature() {
  // Generate a random temperature change in the range of ±0.5°C
  const change = (Math.random() - 0.5) * 1;
  const currentTemp = temperatures[temperatures.length - 1] + change;

  // Update the temperatures array
  temperatures.push(Number(currentTemp.toFixed(1)));
  if (temperatures.length > 30) temperatures.shift(); // Keep the array length manageable

  // Recalculate max, min, and avg temperatures
  maxTemp = Math.max(...temperatures);
  minTemp = Math.min(...temperatures);
  avgTemp = (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1);

  updateTemperatureDisplay();
  drawTemperatureGraph();
}

// Initial load
updateTemperatureDisplay();
drawTemperatureGraph();

// Generate a new random temperature every 2 seconds
setInterval(generateRandomTemperature, 2000);





//------------------------------//-----------------------------------//-----------------------------------//
//----------------------------//---------------------------------//---------------------------------------//
//------------------------------//-------------------------------//----------------------------------------------//

// now we will go for the dashoard



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
