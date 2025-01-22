let percentage = 1;
const progressBar = document.querySelector('.progress-bar');
const bicycleIcon = document.querySelector('.bicycle-icon');
const loadingText = document.getElementById('loading-percentage');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('close-popup');

// Simulate loading from 1% to 100%
const interval = setInterval(() => {
  if (percentage <= 100) {
    progressBar.style.width = `${percentage}%`; // Update the progress bar
    bicycleIcon.style.left = `calc(${percentage}% - 30px)`; // Sync bicycle movement
    loadingText.textContent = `${percentage}%`; // Update the percentage text
    percentage++;
  } else {
    clearInterval(interval); // Stop the loader
    showPopup(); // Show the popup after loading is complete
  }
}, 80); // Adjust the interval to control the speed
// Show the popup
function showPopup() {
  popup.style.display = 'flex';
}

// Close the popup and redirect to homepage
closePopup.addEventListener('click', () => {
  popup.style.display = 'none';
  window.location.href = 'homepage1.html'; // Redirect to the homepage
});