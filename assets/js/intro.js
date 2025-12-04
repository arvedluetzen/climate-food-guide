// Intro pie chart - Food sector emissions
let foodChart = null;

function initFoodChart() {
  const ctx = document.getElementById('foodEmissionsChart');
  if (!ctx) return;

  // Destroy existing chart if it exists
  if (foodChart) {
    foodChart.destroy();
  }

  foodChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Food', 'Rest'],
      datasets: [{
        data: [30, 70],
        backgroundColor: ['#19a966', '#d1d5db'],
        borderColor: ['#19a966', '#d1d5db'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false
        }
      },
      animation: {
        duration: 1500  // Disable animation to maintain size
      }
    }
  });

  // Make the label clickable to navigate to detail page
  const label = document.getElementById('chartLabel');
  if (label) {
    label.addEventListener('click', function() {
      openDetailPage(document.getElementById('main-content'), '1-emissions-overview');
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initFoodChart);

// Re-initialize chart when returning from detail page
if (!window.diagramReloadHandlers) {
  window.diagramReloadHandlers = [];
}
window.diagramReloadHandlers.push(initFoodChart);