const express = require('express');
const router = express.Router();

// Home page - same routing for root path
router.get('/', (req, res) => {
  res.render('pages/index', { 
    title: 'Revelate Operations | Data-Driven SaaS Consulting'
  });
});

// About page
router.get('/about', (req, res) => {
  res.render('pages/about', { 
    title: 'About Us | Revelate Operations'
  });
});

// Services page
router.get('/services', (req, res) => {
  res.render('pages/services', { 
    title: 'Our Services | Revelate Operations'
  });
});

// Approach page
router.get('/approach', (req, res) => {
  res.render('pages/approach', { 
    title: 'Our Approach | Revelate Operations'
  });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('pages/contact', { 
    title: 'Contact Us | Revelate Operations'
  });
});

// Case Studies page
router.get('/case-studies', (req, res) => {
  res.render('pages/case-studies', { 
    title: 'Case Studies | Revelate Operations'
  });
});

// Assessment page
router.get('/assessment', (req, res) => {
  res.render('pages/assessment', { 
    title: 'Assessment | Revelate Operations'
  });
});

// Offline page - no layout
router.get('/offline', (req, res) => {
  res.render('pages/offline', { 
    layout: false
  });
});

module.exports = router;const express = require('express');
const router = express.Router();

// Home page - same routing for root path
router.get('/', (req, res) => {
  const data = getCommonData('Revelate Operations | Data-Driven SaaS Consulting');
  res.render('pages/', data);
  
// About page
router.get('/about', (req, res) => {
  res.render('pages/about', { 
    title: 'About Us | Revelate Operations'
  });
});

// Services page
router.get('/services', (req, res) => {
  res.render('pages/services', { 
    title: 'Our Services | Revelate Operations'
  });
});

// Approach page
router.get('/approach', (req, res) => {
  res.render('pages/approach', { 
    title: 'Our Approach | Revelate Operations'
  });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('pages/contact', { 
    title: 'Contact Us | Revelate Operations'
  });
});

// Case Studies page
router.get('/case-studies', (req, res) => {
  res.render('pages/case-studies', { 
    title: 'Case Studies | Revelate Operations'
  });
});

// Assessment page
router.get('/assessment', (req, res) => {
  res.render('pages/assessment', { 
    title: 'Assessment | Revelate Operations'
  });
});

// Offline page - no layout
router.get('/offline', (req, res) => {
  res.render('pages/offline', { 
    layout: false
  });
});

module.exports = router;
