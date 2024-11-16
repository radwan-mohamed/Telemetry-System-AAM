// Global variables
let speed = [];
let time = [];
let rpm = [];

// Chart instances
let speedTimeChart;
let rpmTimeChart;
const MAX_DATA_POINTS = 100; // Limit data to 100 points for performance

// Initialize the charts
function initializeCharts() {
    const ctx1 = document.getElementById('speedTimeChart').getContext('2d');
    const ctx2 = document.getElementById('rpmTimeChart').getContext('2d');

    speedTimeChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: time, // X-axis (Time)
            datasets: [{
                label: 'Speed',
                data: speed,
                borderColor: 'royalblue',
                backgroundColor: 'rgba(65, 105, 225, 0.1)',
                pointBackgroundColor: function(context) {
                    const value = context.dataset.data[context.dataIndex];
                    return value > 100 ? 'red' : (value > 50 ? 'yellow' : 'blue');
                },
                pointRadius: 5, // Add dots for speed chart
                tension: 0.4 // Smoothing the line
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { 
                        display: true, 
                        text: 'Time', 
                        color: 'white' // Color of X-axis label
                    },
                    ticks: {
                        color: 'white' // Color of the X-axis ticks (numbers)
                    }
                },
                y: {
                    title: { 
                        display: true, 
                        text: 'Speed', 
                        color: 'white' // Color of Y-axis label
                    },
                    ticks: {
                        color: 'white', // Color of the Y-axis ticks (numbers)
                        stepSize: 50
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white' // Color of the legend label (Speed)
                    }
                }
            }
        }
    });

    rpmTimeChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: time, // X-axis (Time)
            datasets: [{
                label: 'RPM',
                data: rpm,
                borderColor: 'red',
                backgroundColor: 'rgba(0, 128, 0, 0.1)',
                pointRadius: 5,  // Add dots with size 5
                pointBackgroundColor: function(context) {
                    const value = context.dataset.data[context.dataIndex];
                    
                    // Apply color based on RPM value
                    if (value <= 2000) {
                        return 'white';  // RPM 0-2000 (white)
                    } else if (value <= 4000) {
                        return 'blue';  // RPM 2000-4000 (blue)
                    } else {
                        return 'red';  // RPM above 4000 (red)
                    }
                },
                pointBorderColor: 'black',  // Border color of the dots (optional)
                pointBorderWidth: 2,  // Border width of the dots (optional)
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { 
                        display: true, 
                        text: 'Time', 
                        color: 'white' // Color of X-axis label
                    },
                    ticks: {
                        color: 'white' // Color of the X-axis ticks (numbers)
                    }
                },
                y: {
                    title: { 
                        display: true, 
                        text: 'RPM', 
                        color: 'white' // Color of Y-axis label
                    },
                    ticks: {
                        color: 'white', // Color of the Y-axis ticks (numbers)
                        stepSize: 1000
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white' // Color of the legend label (RPM)
                    }
                }
            }
        }
    });

    // Start updating data every second
    setInterval(updateData, 1000);
}

// Simulate data update every second
function updateData() {
    const currentTime = time.length ? time[time.length - 1] + 1 : 0; // Increment time or start from 0
    const currentSpeed = Math.floor(Math.random() * 150); // Simulate speed between 0 and 150
    const currentRpm = Math.floor(Math.random() * 5000); // Simulate RPM between 0 and 5000

    // Update the arrays
    time.push(currentTime);
    speed.push(currentSpeed);
    rpm.push(currentRpm);

    // Ensure that we are not keeping too many data points
    if (time.length > MAX_DATA_POINTS) {
        time.shift();
        speed.shift();
        rpm.shift();
    }

    // // Dynamically adjust the width of the chart container every 10, 20, 30 seconds
    if (currentTime % 10 === 0) {
        let newWidth = Math.min(600 + currentTime * 5, 1000);  // Increment width based on time
    document.getElementById('speedChartContainer').style.width = newWidth + 'px';
    document.getElementById('rpmChartContainer').style.width = newWidth + 'px';
    
    }

    // Update charts
    plotGraph_speed_time();
    plotGraph_rpm_time();
}

// Update speed chart
function plotGraph_speed_time() {
    if (speedTimeChart) {
        speedTimeChart.data.labels = time;
        speedTimeChart.data.datasets[0].data = speed;
        speedTimeChart.update();
    }
}

// Update RPM chart
function plotGraph_rpm_time() {
    if (rpmTimeChart) {
        rpmTimeChart.data.labels = time;
        rpmTimeChart.data.datasets[0].data = rpm;
        rpmTimeChart.update();
    }
}

// Initialize charts on page load
window.onload = initializeCharts;
