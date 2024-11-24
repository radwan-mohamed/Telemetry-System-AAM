const ctx = document.getElementById('graph').getContext('2d');
const slider = document.getElementById('dataSlider');
const startTimeLabel = document.getElementById('startTime');
const endTimeLabel = document.getElementById('endTime');

// Data buffers
let maxBufferSize = 100; // Number of data points to store

// Gear Ratios (simulated)
const gearRatios = [4.0, 3.0, 2.2, 1.6, 1.2]; // Gears 1 to 5
let currentGear = 0; // Start in the first gear

// Vehicle constants
const wheelDiameter = 0.6; // in meters
const engineMaxRPM = 8000;

// Convert RPM to speed (based on gear and wheel diameter)
function rpmToSpeed(rpm, gearRatio) {
    const wheelCircumference = Math.PI * wheelDiameter; // in meters
    const speed = (rpm / gearRatio) * (wheelCircumference / 60) * 3.6; // in km/h
    return speed;
}

// Create the chart
const chart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [
            {
                label: 'RPM vs Speed',
                data: [], // Scatter plot expects an array of {x, y} objects
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.3)',
                showLine: true, // Connect points with a line
                tension: 0.2,
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
                    text: 'RPM',
                },
                min: 0,
                max: engineMaxRPM,
            },
            y: {
                title: {
                    display: true,
                    text: 'Speed (km/h)',
                },
                min: 0,
                max: 300,
            },
        },
    },
});

// Simulate live data updates
let rpm = 1000; // Starting RPM

function updateData() {
    const gearRatio = gearRatios[currentGear];
    const speed = rpmToSpeed(rpm, gearRatio);

    // Add new data point as {x: rpm, y: speed}
    chart.data.datasets[0].data.push({ x: rpm, y: speed });

    // Simulate RPM changes
    rpm += Math.random() * 500; // Simulate RPM increase
    if (rpm > engineMaxRPM) {
        rpm = 1000; // Reset to lower RPM
        currentGear = Math.min(currentGear + 1, gearRatios.length - 1); // Shift up
    }

    // Simulate gear downshift
    if (Math.random() < 0.01 && currentGear > 0) {
        currentGear -= 1; // Downshift occasionally
        rpm = Math.max(rpm - 2000, 1000); // Reduce RPM on downshift
    }

    // Limit buffer size
    if (chart.data.datasets[0].data.length > maxBufferSize) {
        chart.data.datasets[0].data.shift();
    }

    // Update chart
    chart.update();

    // Update slider
    slider.max = chart.data.datasets[0].data.length - 1;
    endTimeLabel.textContent = `${chart.data.datasets[0].data.length}s`;
}

// Handle slider changes
slider.addEventListener('input', () => {
    const index = slider.value;
    chart.data.datasets[0].data = chart.data.datasets[0].data.slice(0, parseInt(index) + 1);
    chart.update();
});

// Update data every second
setInterval(updateData, 1000);
