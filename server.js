/**
 * Revelate Operations - Main Server
 * Root server file for Heroku deployment
 */

// Import the main application
require('./src/app');

// The app is already configured to listen on the appropriate port in src/app.js
console.log('Server started - using Express.js implementation');