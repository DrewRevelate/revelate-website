const fs = require('fs');
const path = require('path');

// Files to delete
const filesToDelete = [
  // Duplicate/Inconsistent files
  'src/routes/pages.js',

  // Unused/Empty files
  'analytics.html',
  'case-study-card.html',
  'service-card.html',
  'case-studies.yml',
  'team.yml',
  'case-study.html',
  'contact.html',
  'page.html',
  'service.html',

  // Duplicate database configuration (keep the one in src/config)
  'db/database.js',

  // Redirect/Unnecessary files
  'assessment.html'
];

// Function to delete a file
function deleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted: ${filePath}`);
    } else {
      console.log(`⚠️ File not found: ${filePath}`);
    }
  } catch (err) {
    console.error(`❌ Error deleting ${filePath}: ${err.message}`);
  }
}

// Delete all files in the list
console.log('Starting file cleanup...');
filesToDelete.forEach(file => {
  const filePath = path.resolve(__dirname, file);
  deleteFile(filePath);
});
console.log('File cleanup completed.');