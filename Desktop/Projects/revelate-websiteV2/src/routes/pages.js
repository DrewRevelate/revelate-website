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
    layout: 'layouts/main',
    bodyClass: 'home-page',
    pageScript: 'home',
    pageStylesheet: 'home'
  });
});

// Services page
router.get('/services', (req, res) => {
  res.render('pages/services', {
    title: 'Our Services | Revelate Operations',
    layout: 'layouts/main',
    pageScript: 'services',
    pageStylesheet: 'services'
  });
});

// Approach page
router.get('/approach', (req, res) => {
  res.render('pages/approach', {
    title: 'Our Approach | Revelate Operations',
    layout: 'layouts/main',
    pageScript: 'approach',
    pageStylesheet: 'approach'
  });
});

// About page
router.get('/about', (req, res) => {
  res.render('pages/about', {
    title: 'About Us | Revelate Operations',
    layout: 'layouts/main',
    pageScript: 'about',
    pageStylesheet: 'about'
  });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('pages/contact', {
    title: 'Contact Us | Revelate Operations',
    layout: 'layouts/main',
    pageScript: 'contact',
    pageStylesheet: 'contact'
  });
});

// Case Studies listing page
router.get('/case-studies', (req, res) => {
  res.render('pages/case-studies/index', {
    title: 'Case Studies | Revelate Operations',
    layout: 'layouts/main',
    pageScript: 'case-studies',
    pageStylesheet: 'case-studies'
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
      layout: 'layouts/main',
      pageScript: 'case-study-detail',
      pageStylesheet: 'case-study-detail'
    });
  });
});

// Privacy policy page
router.get('/privacy-policy', (req, res) => {
  res.render('pages/privacy-policy', {
    title: 'Privacy Policy | Revelate Operations',
    layout: 'layouts/main'
  });
});

// Terms of service page
router.get('/terms-of-service', (req, res) => {
  res.render('pages/terms-of-service', {
    title: 'Terms of Service | Revelate Operations',
    layout: 'layouts/main'
  });
});

module.exports = router;
