// Intro pie chart - Food sector emissions
document.addEventListener('DOMContentLoaded', initFoodChart);
let foodChart = null;

function tc(name, fallback) {
  return (window.themeColors && window.themeColors[name]) || fallback;
}

function initFoodChart() {
  const canvas = document.getElementById('foodEmissionsChart');
  if (!canvas) return;

  // Destroy existing chart if it exists
  if (foodChart) {
    foodChart.destroy();
    foodChart = null;
  }

  // Create chart; allow it to size to its container
  foodChart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Food', 'Rest'],
        datasets: [{
        data: [30, 70],
        backgroundColor: [tc('primary50', '#22c55e'), tc('GREY200', '#d1d5db')],
        borderColor: [tc('primary50', '#22c55e'), tc('GREY200', '#d1d5db')],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      animation: { duration: 600 }
    }
  });

  // Ensure chart fits its container (Chart.js will handle this, but call resize to be safe)
  setTimeout(() => { try { foodChart.resize(); } catch (e) {} }, 30);

  // Attach a single click handler (assigning avoids duplicating listeners)
  const label = document.getElementById('chartLabel');
  if (label) {
    label.onclick = function() {
      openDetailPage(document.getElementById('main-content'), '1-emissions-overview');
    };
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initFoodChart);

// Re-initialize chart when returning from detail page
if (!window.diagramReloadHandlers) window.diagramReloadHandlers = [];
window.diagramReloadHandlers.push(initFoodChart);