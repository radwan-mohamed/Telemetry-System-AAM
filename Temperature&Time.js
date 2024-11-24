const ctx = document.getElementById('graph').getContext('2d');
const slider = document.getElementById('dataSlider');
const startTimeLabel = document.getElementById('startTime');
const endTimeLabel = document.getElementById('endTime');

// Data buffers
let temperatureData = [];
let timeLabels = [];
const maxBufferSize = 100; // Number of data points to store
let currentTime = 0; // Starting time in seconds

// Create the Chart.js chart
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: timeLabels, // X-axis: Time
        datasets: [
            {
                label: 'Temperature (°C)',
                data: temperatureData, // Y-axis: Temperature
                borderColor: 'red',
                backgroundColor: 'rgba(255, 0, 0, 0.3)',
                tension: 0.2, // Smooth the line
                fill: false,
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (s)',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Temperature (°C)',
                },
                min: 15,
                max: 45, // Temperature range
            },
        },
    },
});

// Simulate live temperature data
function updateData() {
    // Generate realistic temperature values (20°C to 40°C with small fluctuations)
    const temperature = 20 + Math.random() * 20 + Math.sin(currentTime / 10) * 3;

    // Add data
    temperatureData.push(temperature.toFixed(2));
    timeLabels.push(`${currentTime}s`);

    currentTime++; // Increment time

    // Limit buffer size
    if (temperatureData.length > maxBufferSize) {
        temperatureData.shift();
        timeLabels.shift();
    }

    // Update the chart
    chart.update();

    // Update slider
    slider.max = timeLabels.length - 1;
    endTimeLabel.textContent = `${timeLabels[timeLabels.length - 1]}`;
}

// Handle slider changes
slider.addEventListener('input', () => {
    const index = slider.value;
    chart.data.labels = timeLabels.slice(0, parseInt(index) + 1);
    chart.data.datasets[0].data = temperatureData.slice(0, parseInt(index) + 1);
    chart.update();
});

// Update data every second
setInterval(updateData, 1000);
