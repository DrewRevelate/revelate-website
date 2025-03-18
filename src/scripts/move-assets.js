/**
 * Revelate Operations - Asset Migration Script
 * This script moves static assets from the old directory structure to the new Express.js structure
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define directories
const sourceDir = path.join(__dirname, '..', '..');
const targetDir = path.join(__dirname, '..', '..', 'assets');

// Ensure target directories exist
console.log('Creating target directories...');
const directories = [
    path.join(targetDir, 'css'),
    path.join(targetDir, 'js'),
    path.join(targetDir, 'images'),
    path.join(targetDir, 'images', 'testimonials'),
    path.join(targetDir, 'images', 'case-studies')
];

directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// Copy CSS files
console.log('\nCopying CSS files...');
if (fs.existsSync(path.join(sourceDir, 'css'))) {
    execSync(`cp -R "${path.join(sourceDir, 'css')}"/* "${path.join(targetDir, 'css')}/"`);
    console.log('✅ CSS files copied successfully');
} else {
    console.log('❌ CSS directory not found');
}

// Copy JS files
console.log('\nCopying JavaScript files...');
if (fs.existsSync(path.join(sourceDir, 'js'))) {
    execSync(`cp -R "${path.join(sourceDir, 'js')}"/* "${path.join(targetDir, 'js')}/"`);
    console.log('✅ JavaScript files copied successfully');
} else {
    console.log('❌ JS directory not found');
}

// Copy image files
console.log('\nCopying image files...');
if (fs.existsSync(path.join(sourceDir, 'images'))) {
    execSync(`cp -R "${path.join(sourceDir, 'images')}"/* "${path.join(targetDir, 'images')}/"`);
    console.log('✅ Image files copied successfully');
} else {
    console.log('❌ Images directory not found');
}

// Move contact.js to assets/js directory
const contactJsSource = path.join(targetDir, 'js', 'contact.js');
const contactJsTarget = path.join(targetDir, 'js', 'contact.js');

if (fs.existsSync(contactJsSource)) {
    fs.copyFileSync(contactJsSource, contactJsTarget);
    console.log('✅ contact.js copied successfully');
} else {
    console.log('⚠️ contact.js not found in source directory, using our custom version');
}

console.log('\nAsset migration completed successfully!');
console.log('You can now update your Express.js application to use the new asset paths.');
