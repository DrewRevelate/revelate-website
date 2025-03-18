/**
 * Page Routes for Revelate Operations
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Home page
router.get('/', (req, res) => {
  res.render('pages/index', {
    title: 'Revelate Operations | Data-Driven SaaS Consulting',
    layout: 'layouts/main'
  });
});

// Services page
router.get('/services', (req, res) => {
  res.render('pages/services', {
    title: 'Our Services | Revelate Operations',
    layout: 'layouts/main'
  });
});

// Approach page
router.get('/approach', (req, res) => {
  res.render('pages/approach', {
    title: 'Our Approach | Revelate Operations',
    layout: 'layouts/main'
  });
});

// About page
router.get('/about', (req, res) => {
  res.render('pages/about', {
    title: 'About Us | Revelate Operations',
    layout: 'layouts/main'
  });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('pages/contact', {
    title: 'Contact Us | Revelate Operations',
    layout: 'layouts/main'
  });
});

// Case Studies listing page
router.get('/case-studies', (req, res) => {
  res.render('pages/case-studies/index', {
    title: 'Case Studies | Revelate Operations',
    layout: 'layouts/main'
  });
});

// Individual case study pages
// This function will dynamically handle individual case studies based on their URL
router.get('/case-studies/:study', (req, res, next) => {
  const studyName = req.params.study;
  const viewPath = path.join(__dirname, '..', 'views', 'pages', 'case-studies', `${studyName}.ejs`);
  
  // Check if the view exists
  fs.access(viewPath, fs.constants.F_OK, (err) => {
    if (err) {
      // View doesn't exist, pass to next handler (will result in 404)
      return next();
    }
    
    // Render the case study
    res.render(`pages/case-studies/${studyName}`, {
      title: `${studyName.replace(/-/g, ' ')} | Revelate Operations`,
      layout: 'layouts/main'
    });
  });
});

module.exports = router;
