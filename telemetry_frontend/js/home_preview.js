window.onload = () => {
  const gaugeCanvas = document.getElementById('previewGauge');
  const gaugeCtx = gaugeCanvas.getContext('2d');
  let angle = 0;

  function drawPreviewGauge(value) {
    gaugeCtx.clearRect(0, 0, gaugeCanvas.width, gaugeCanvas.height);
    const radius = 100;
    const centerX = 150;
    const centerY = 150;

    // Arc
    gaugeCtx.beginPath();
    gaugeCtx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
    gaugeCtx.strokeStyle = '#ddd';
    gaugeCtx.lineWidth = 10;
    gaugeCtx.stroke();

    // Needle
    const needleAngle = Math.PI + (value / 100) * Math.PI;
    const endX = centerX + radius * Math.cos(needleAngle);
    const endY = centerY + radius * Math.sin(needleAngle);
    gaugeCtx.beginPath();
    gaugeCtx.moveTo(centerX, centerY);
    gaugeCtx.lineTo(endX, endY);
    gaugeCtx.strokeStyle = '#ff3b30';
    gaugeCtx.lineWidth = 4;
    gaugeCtx.stroke();
  }

  setInterval(() => {
    angle = (angle + 5) % 100;
    drawPreviewGauge(angle);
  }, 150);

  // Replace static text with real Chart.js preview
  const gctx = document.getElementById('previewGraph').getContext('2d');
  const demoChart = new Chart(gctx, {
    type: 'line',
    data: {
      labels: Array.from({ length: 10 }, (_, i) => i),
      datasets: [{
        label: 'Speed Preview',
        data: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100)),
        borderColor: 'blue',
        backgroundColor: 'rgba(0,0,255,0.1)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: '#121212' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#121212' },
          title: { display: true, text: 'Time', color: '#121212' }
        },
        y: {
          ticks: { color: '#121212' },
          title: { display: true, text: 'Value', color: '#121212' }
        }
      }
    }
  });
};
