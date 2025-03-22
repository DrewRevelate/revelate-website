/**
 * Main schema for Sanity CMS
 * Imports all other schemas and combines them
 */

// Import your schemas
const caseStudy = require('./caseStudy');
const teamMember = require('./teamMember');
const serviceCard = require('./serviceCard');
const siteImages = require('./siteImages');

// Export the schema array
module.exports = [
  caseStudy,
  teamMember,
  serviceCard,
  siteImages
];
