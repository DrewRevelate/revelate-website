/**
 * Page Routes for Revelate Operations
 */

const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

// Main pages
router.get('/', pageController.getHomePage);
router.get('/services', pageController.getServicesPage);
router.get('/approach', pageController.getApproachPage);
router.get('/about', pageController.getAboutPage);
router.get('/contact', pageController.getContactPage);
router.get('/assessment', pageController.getAssessmentPage);

// Case Studies
router.get('/case-studies', pageController.getCaseStudiesPage);
router.get('/case-studies/:study', pageController.getCaseStudyDetail);

// Projects
router.get('/projects', pageController.getProjectsPage);
router.get('/projects/:project', pageController.getProjectDetail);

// Service Worker offline page
router.get('/offline', pageController.getOfflinePage);

module.exports = router;