// This is a simplified version of the server.js file specifically for Vercel's serverless functions
const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, '..')));

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/:page', (req, res) => {
  const page = req.params.page;
  const htmlFile = path.join(__dirname, '..', `${page}.html`);
  
  // Check if the HTML file exists
  try {
    const fs = require('fs');
    if (fs.existsSync(htmlFile)) {
      return res.sendFile(htmlFile);
    }
    // If not, return 404
    res.status(404).sendFile(path.join(__dirname, '..', '404.html'));
  } catch (e) {
    res.status(404).sendFile(path.join(__dirname, '..', '404.html'));
  }
});

// Export the Express app for Vercel
module.exports = app;
