const ctx = document.getElementById('graph').getContext('2d');
const slider = document.getElementById('dataSlider');
const startTimeLabel = document.getElementById('startTime');
const endTimeLabel = document.getElementById('endTime');

// Data buffers
let speedData = [];
let rpmData = [];
let labels = [];
let maxBufferSize = 100; // Number of data points to store

// Create the chart
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Speed (km/h)',
                data: speedData,
                borderColor: 'blue',
                tension: 0.2,
                fill: false,
            },
            {
                label: 'RPM',
                data: rpmData,
                borderColor: 'red',
                tension: 0.2,
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
                    text: 'Value',
                },
            },
        },
    },
});

// Simulate live data updates
function updateData() {
    const time = labels.length;
    const speed = Math.random() * 200; // Random speed data (0-200 km/h)
    const rpm = Math.random() * 8000; // Random RPM data (0-8000)

    // Add new data
    labels.push(time + 's');
    speedData.push(speed);
    rpmData.push(rpm);

    // Limit buffer size
    if (labels.length > maxBufferSize) {
        labels.shift();
        speedData.shift();
        rpmData.shift();
    }

    // Update chart
    chart.update();

    // Update slider
    slider.max = labels.length - 1;
    endTimeLabel.textContent = `${labels[labels.length - 1]}`;
}

// Handle slider changes
slider.addEventListener('input', () => {
    const index = slider.value;
    chart.data.labels = labels.slice(0, parseInt(index) + 1);
    chart.data.datasets[0].data = speedData.slice(0, parseInt(index) + 1);
    chart.data.datasets[1].data = rpmData.slice(0, parseInt(index) + 1);
    chart.update();
});

// Update data every second
setInterval(updateData, 1000);
