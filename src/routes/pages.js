/**
 * Page Routes for Revelate Operations
 * Handles rendering the static pages with dynamic content
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Site metadata
const siteData = {
  title: 'Revelate Operations',
  description: 'Data-driven SaaS consulting specializing in Salesforce, CRM management and business intelligence solutions.',
  keywords: 'revelate, operations, saas, data, crm, salesforce, business intelligence',
  url: 'https://revelateops.com',
};

// Common data for all pages
const getCommonData = (pageTitle, pageDescription = null, pageKeywords = null) => {
  return {
    site: siteData,
    page: {
      title: pageTitle ? `${pageTitle} | ${siteData.title}` : siteData.title,
      description: pageDescription || siteData.description,
      keywords: pageKeywords || siteData.keywords,
      url: siteData.url
    },
    currentYear: new Date().getFullYear()
  };
};

// Index
router.get('/', (req, res) => {
  res.render('pages/index', { 
    title: 'Revelate Operations | Data-Driven SaaS Consulting'
  });
});

// About page
router.get('/about', (req, res) => {
  const data = getCommonData('About Us', 'Learn about our company, our mission, and our team of experts.');
  res.render('pages/about', data);
});

// Services page
router.get('/services', (req, res) => {
  const data = getCommonData('Our Services', 'Explore our data-driven consulting services including CRM management, business intelligence, and more.');
  res.render('pages/services', data);
});

// Approach page
router.get('/approach', (req, res) => {
  const data = getCommonData('Our Approach', 'Discover our systematic methodology to transform your data into strategic wealth.');
  res.render('pages/approach', data);
});

// Assessment page
router.get('/assessment', (req, res) => {
  const data = getCommonData('RevOps Assessment', 'Take our free assessment to evaluate your current revenue operations maturity.');
  res.render('pages/assessment', data);
});

// Contact page
router.get('/contact', (req, res) => {
  const data = getCommonData('Contact Us', 'Get in touch with our team to discuss your RevOps needs.');
  res.render('pages/contact', data);
});

// Projects page
router.get('/projects', (req, res) => {
  const data = getCommonData('Our Projects', 'Explore our latest RevOps projects and case studies.');
  res.render('pages/projects', data);
});

// Case Studies main page
router.get('/case-studies', (req, res) => {
  const data = getCommonData('Case Studies', 'Explore real-world examples of how we help companies transform their operations.');
  res.render('pages/case-studies/index', data);
});

// Individual Case Study pages
router.get('/case-studies/:slug', (req, res, next) => {
  const { slug } = req.params;
  
  // Define case study data or fetch from database
  const caseStudies = {
    '22q-family-foundation': {
      title: '22q Family Foundation',
      description: 'How we helped a non-profit streamline their operations and increase donations through CRM integration.',
      template: 'pages/case-studies/22q-family-foundation'
    },
    'case-study-1': {
      title: 'Case Study 1',
      description: 'Sample case study description.',
      template: 'pages/case-studies/case-study-1'
    }
  };
  
  const study = caseStudies[slug];
  
  if (!study) {
    return next(); // Pass to 404 handler
  }
  
  const data = getCommonData(study.title, study.description);
  data.caseStudy = study;
  
  res.render(study.template, data);
});

// Projects - Industries Day
router.get('/projects/industries-day', (req, res) => {
  const data = getCommonData('Industries Day Project', 'Case study of the Industries Day event management system.');
  res.render('pages/projects/industries-day', data);
});

module.exports = router;