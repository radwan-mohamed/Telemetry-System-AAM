// Temperature.js

const currentTempElem = document.getElementById('currentTemp');
const maxTempElem = document.getElementById('maxTemp');
const minTempElem = document.getElementById('minTemp');
const avgTempElem = document.getElementById('avgTemp');
const tempFillElem = document.getElementById('tempFill');
const tempGraph = document.getElementById('tempGraph').getContext('2d');

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
