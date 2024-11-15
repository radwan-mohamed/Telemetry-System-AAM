// fuel_level.js
const progressBar = document.getElementById('progress-bar');
const fuelLevelText = document.getElementById('fuel-level-text');
const fuelAlarm = document.getElementById('fuel-alarm'); // Added reference to the fuel alarm icon

// Number of segments for the progress bar
const numSegments = 20;

// Create segments dynamically
for (let i = 0; i < numSegments; i++) {
    const segment = document.createElement('div');
    segment.classList.add('segment');
    progressBar.appendChild(segment);
}

// Set fuel level (0-100%) here to update the display
let fuelLevel = 100; // Change this value to simulate fuel level

// Update fuel level display
function updateFuelLevelDisplay(level) {
    fuelLevelText.textContent = `Fuel: ${level}%`;
    
    // Calculate the number of active segments based on fuel level
    const activeSegments = Math.round((level / 100) * numSegments);
    
    // Update segments to show fuel level and color code
    Array.from(progressBar.children).forEach((segment, index) => {
        if (index < activeSegments) {
            segment.style.backgroundColor = getFuelColor(level);
        } else {
            segment.style.backgroundColor = '#e0e0e0'; // Inactive color
        }
    });

    // Show or hide the fuel alarm icon based on the fuel level
    if (level <= 25) {
        fuelAlarm.style.display = 'block'; // Show alarm icon when fuel level is low
        fuelAlarm.style.filter = 'none'; // Remove grayscale filter
        fuelAlarm.style.backgroundColor = '#dc3545'; // Change color to red
    } else {
        fuelAlarm.style.display = 'none'; // Hide alarm icon when fuel level is sufficient
        fuelAlarm.style.filter = 'grayscale(1)'; // Add grayscale filter
    }
}

// Function to determine color based on fuel level
function getFuelColor(level) {
    if (level > 75) {
        return '#28a745'; // Green
    } else if (level > 50) {
        return '#7fdc43'; // Light Green
    } else if (level > 25) {
        return '#ffc107'; // Yellow
    } else {
        return '#dc3545'; // Red
    }
}

// Initial display
updateFuelLevelDisplay(fuelLevel);

// For simulation, change the fuel level after a few seconds
// (This could be replaced with live data updates in a real scenario)
setTimeout(() => { updateFuelLevelDisplay(75); }, 2000);
setTimeout(() => { updateFuelLevelDisplay(50); }, 4000);
setTimeout(() => { updateFuelLevelDisplay(25); }, 6000);
setTimeout(() => { updateFuelLevelDisplay(10); }, 8000);
