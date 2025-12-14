// Main JavaScript file - imports all modular functionality
// Import and initialize all game modules

import('./js/main.js')
  .then(() => {
    console.log('Sliders game modules loaded successfully');
  })
  .catch(error => {
    console.error('Error loading game modules:', error);
  });