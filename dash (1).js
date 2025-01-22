// script.js

// Simulate data fetching from an API
function fetchData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          power: Math.floor(Math.random() * 500), // Random power in watts
          calories: Math.floor(Math.random() * 1000), // Random calories in kcal
          distance: (Math.random() * 50).toFixed(2), // Random distance in km
          score: Math.floor(Math.random() * 10000), // Random score
          energy: (Math.random() * 2000).toFixed(2), // Random energy in kJ
        });
      }, 1000);
    });
  }
  
  // Update the metrics dynamically
  async function updateDashboard() {
    try {
      const data = await fetchData();
      document.getElementById('power-data').textContent = `${data.power} W`;
      document.getElementById('calories-data').textContent = `${data.calories} kcal`;
      document.getElementById('distance-data').textContent = `${data.distance} km`;
      document.getElementById('score-data').textContent = `${data.score} pts`;
      document.getElementById('energy-data').textContent = `${data.energy} kJ`;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  // Refresh the data every 3 seconds
  setInterval(updateDashboard, 3000);
  