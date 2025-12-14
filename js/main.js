// Main application initialization
import { initializeUIHandlers } from './ui-handlers.js';

// Initialize the application when components are loaded
document.addEventListener('componentsLoaded', () => {
    initializeUIHandlers();
});

// Fallback for direct access to main.js
if (document.readyState === 'complete') {
    setTimeout(() => initializeUIHandlers(), 100);
}