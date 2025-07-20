let time = [], speed = [], rpm = [], throttle = [], brake = [], temperature = [];

const MAX_DATA_POINTS = 100;

let speedTimeChart, rpmTimeChart, throttleBrakeChart, rpmSpeedChart, tempTimeChart, tempSpeedChart, tempRpmChart;

function createChart(id, labelX, labelY, datasets) {
  const ctx = document.getElementById(id).getContext('2d');
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: datasets
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: labelX, color: 'white' },
          ticks: { color: 'white' }
        },
        y: {
          title: { display: true, text: labelY, color: 'white' },
          ticks: { color: 'white' }
        }
      },
      plugins: {
        legend: { labels: { color: 'white' } },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.formattedValue}`
          }
        }
      }
    }
  });
}

function initializeCharts() {
  speedTimeChart = createChart('speedTimeChart', 'Time (s)', 'Speed (KPH)', [{
    label: 'Speed',
    data: [],
    borderColor: 'royalblue',
    backgroundColor: 'rgba(65, 105, 225, 0.1)',
    pointRadius: 4,
    tension: 0.4
  }]);

  rpmTimeChart = createChart('rpmTimeChart', 'Time (s)', 'RPM', [{
    label: 'RPM',
    data: [],
    borderColor: 'red',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    pointRadius: 4,
    tension: 0.4
  }]);

  throttleBrakeChart = createChart('throttleBrakeChart', 'Time (s)', '%', [
    {
      label: 'Throttle %',
      data: [],
      borderColor: '#00ff88',
      backgroundColor: 'rgba(0,255,136,0.2)',
      pointRadius: 3,
      tension: 0.4
    },
    {
      label: 'Brake %',
      data: [],
      borderColor: '#ffcc00',
      backgroundColor: 'rgba(255,204,0,0.2)',
      pointRadius: 3,
      tension: 0.4
    }
  ]);

  rpmSpeedChart = createChart('rpmSpeedChart', 'Speed (KPH)', 'RPM', [{
    label: 'RPM vs Speed',
    data: [],
    borderColor: '#00ffff',
    backgroundColor: 'rgba(0,255,255,0.2)',
    pointRadius: 3,
    tension: 0.4
  }]);

  tempTimeChart = createChart('tempTimeChart', 'Time (s)', 'Temperature (°C)', [{
    label: 'Temperature',
    data: [],
    borderColor: '#ff4081',
    backgroundColor: 'rgba(255,64,129,0.2)',
    pointRadius: 3,
    tension: 0.4
  }]);

  tempSpeedChart = createChart('tempSpeedChart', 'Speed (KPH)', 'Temperature (°C)', [{
    label: 'Temp vs Speed',
    data: [],
    borderColor: '#e040fb',
    backgroundColor: 'rgba(224,64,251,0.2)',
    pointRadius: 3,
    tension: 0.4
  }]);

  tempRpmChart = createChart('tempRpmChart', 'RPM', 'Temperature (°C)', [{
    label: 'Temp vs RPM',
    data: [],
    borderColor: '#7c4dff',
    backgroundColor: 'rgba(124,77,255,0.2)',
    pointRadius: 3,
    tension: 0.4
  }]);

  // Start updating from backend
  setInterval(updateDataFromBackend, 1000);
}

async function updateDataFromBackend() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();

    const t = time.length ? time[time.length - 1] + 1 : 0;

    time.push(t);
    speed.push(data.speed || 0);
    rpm.push(data.rpm || 0);
    throttle.push(data.throttle || 0);
    brake.push(data.brake || 0);
    temperature.push(data.temperature || 0);

    if (time.length > MAX_DATA_POINTS) {
      time.shift(); speed.shift(); rpm.shift(); throttle.shift(); brake.shift(); temperature.shift();
    }

    speedTimeChart.data.labels = [...time];
    speedTimeChart.data.datasets[0].data = [...speed];
    speedTimeChart.update();

    rpmTimeChart.data.labels = [...time];
    rpmTimeChart.data.datasets[0].data = [...rpm];
    rpmTimeChart.update();

    throttleBrakeChart.data.labels = [...time];
    throttleBrakeChart.data.datasets[0].data = [...throttle];
    throttleBrakeChart.data.datasets[1].data = [...brake];
    throttleBrakeChart.update();

    rpmSpeedChart.data.labels = [...speed];
    rpmSpeedChart.data.datasets[0].data = [...rpm];
    rpmSpeedChart.update();

    tempTimeChart.data.labels = [...time];
    tempTimeChart.data.datasets[0].data = [...temperature];
    tempTimeChart.update();

    tempSpeedChart.data.labels = [...speed];
    tempSpeedChart.data.datasets[0].data = [...temperature];
    tempSpeedChart.update();

    tempRpmChart.data.labels = [...rpm];
    tempRpmChart.data.datasets[0].data = [...temperature];
    tempRpmChart.update();

  } catch (error) {
    console.error('Error fetching telemetry for graphs:', error);
  }
}

window.onload = initializeCharts;
