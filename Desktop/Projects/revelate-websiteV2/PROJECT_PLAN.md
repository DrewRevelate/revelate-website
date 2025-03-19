# Revelate Website Implementation Plan

## Current State Assessment

**Local Directory (`revelate-websiteV2`)**: 
- Static HTML website with no backend functionality
- Well-structured HTML, CSS, and JavaScript files
- Contact form exists but doesn't connect to any backend
- No server-side code or database connections

**GitHub Repository (`https://github.com/DrewRevelate/revelate-website/tree/main`)**: 
- Express.js application with PostgreSQL database integration
- Full backend structure including:
  - Server entry point
  - Express application setup
  - API routes for form submissions
  - Database configuration
  - EJS templating

## Implementation Goals

1. Transform the static website into a Node.js/Express application
2. Connect the contact form to a PostgreSQL database
3. Deploy the website to GitHub and Heroku
4. Utilize Heroku's PostgreSQL database for storing form submissions

## Detailed Implementation Plan

### Phase 1: Project Setup

1. Set up Node.js/Express structure in the local directory
   - Create `server.js` (entry point)
   - Create `src/app.js` (Express application)
   - Create `package.json` (dependencies and scripts)
   - Create `.env` file (environment variables)
   - Create `.gitignore` file

2. Install dependencies:
   ```bash
   npm init -y
   npm install express pg ejs express-ejs-layouts dotenv compression helmet serve-favicon body-parser
   npm install --save-dev nodemon eslint
   ```

### Phase 2: Directory Structure Setup

Create the following directory structure:
```
revelate-websiteV2/
├── assets/                   # Moved from css/, js/, images/
│   ├── css/
│   ├── images/
│   ├── js/
├── src/
│   ├── config/               # Configuration files
│   │   └── database.js       # PostgreSQL connection
│   ├── routes/               # Express routes
│   │   ├── api.js            # API endpoints
│   │   └── pages.js          # Page rendering
│   ├── utils/                # Utility functions
│   │   └── validation.js     # Form validation
│   ├── views/                # EJS templates (converted from HTML)
│   │   ├── layouts/          # Layout templates
│   │   ├── pages/            # Page templates
│   │   └── partials/         # Reusable components
│   ├── scripts/              # Utility scripts
│   │   └── setup-db.js       # Database initialization
│   └── app.js                # Express application
├── .env                      # Environment variables
├── .gitignore                # Git ignore file
├── Procfile                  # Heroku deployment file
├── server.js                 # Main entry point
└── package.json              # Dependencies and scripts
```

### Phase 3: Convert Static HTML to Express.js

1. Move static assets:
   - Move `css/` to `assets/css/`
   - Move `js/` to `assets/js/`
   - Move `images/` to `assets/images/`

2. Convert HTML files to EJS templates:
   - Create `src/views/layouts/main.ejs` as the base layout
   - Move HTML files to `src/views/pages/`
   - Extract common elements (header, footer, navigation) to `src/views/partials/`

3. Create server-side routes in `src/routes/pages.js` to render the pages

### Phase 4: Contact Form Integration

1. Create database table for contact submissions:
   ```sql
   CREATE TABLE IF NOT EXISTS contacts (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL,
     phone VARCHAR(50),
     company VARCHAR(255),
     interest VARCHAR(50),
     message TEXT,
     created_at TIMESTAMP NOT NULL
   );
   ```

2. Create API endpoint for form submission in `src/routes/api.js`

3. Update contact form in `contact.html` to submit to the API endpoint:
   ```javascript
   document.getElementById('contactForm').addEventListener('submit', async function(e) {
     e.preventDefault();
     
     // Get form data
     const formData = {
       name: document.getElementById('name').value,
       email: document.getElementById('email').value,
       phone: document.getElementById('phone').value,
       company: document.getElementById('company').value,
       interest: document.getElementById('interest').value,
       message: document.getElementById('message').value
     };
     
     try {
       const response = await fetch('/api/contacts', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify(formData)
       });
       
       const result = await response.json();
       
       if (result.success) {
         // Show success message
         alert('Thank you for your message! We will get back to you soon.');
         this.reset();
       } else {
         alert('There was a problem submitting your form. Please try again.');
       }
     } catch (error) {
       console.error('Error:', error);
       alert('There was a problem connecting to the server. Please try again later.');
     }
   });
   ```

### Phase 5: Database Configuration

1. Create database configuration in `src/config/database.js`
2. Configure for both local development and Heroku deployment
3. Create database initialization script in `src/scripts/setup-db.js`

### Phase 6: Deployment Setup

1. Create `Procfile` for Heroku:
   ```
   web: node server.js
   ```

2. Configure Express app for production:
   - Compression middleware
   - Security headers with Helmet
   - Static file serving

3. Configure environment variables for both development and production

### Phase 7: GitHub and Heroku Deployment

1. Push changes to GitHub repository:
   ```bash
   git add .
   git commit -m "Convert static site to Express.js application"
   git push origin main
   ```

2. Deploy to Heroku:
   - Connect Heroku app to GitHub repository
   - Configure environment variables in Heroku dashboard
   - Enable automatic deployments

### Phase 8: Testing and Verification

1. Test contact form submission to PostgreSQL database
2. Verify all pages are rendering correctly
3. Check mobile responsiveness
4. Verify assets (CSS, JS, images) are loading properly

## Checkpoint Progress Tracking

Below is a checklist to track progress during implementation:

- [x] Phase 1: Project Setup
  - [x] Create base Express files
  - [x] Set up package.json
  - [ ] Install dependencies

- [x] Phase 2: Directory Structure
  - [x] Create required directories
  - [ ] Organize files according to structure

- [ ] Phase 3: Convert Static HTML
  - [x] Move static assets
  - [x] Create EJS templates
  - [x] Create page routes

- [x] Phase 4: Contact Form Integration
  - [x] Create database schema
  - [x] Create API endpoint
  - [x] Update contact form

- [x] Phase 5: Database Configuration
  - [x] Set up database connection
  - [x] Create initialization script

- [x] Phase 6: Deployment Setup
  - [x] Create Procfile
  - [x] Configure for production

- [ ] Phase 7: Deployment
  - [x] Push to GitHub
  - [ ] Deploy to Heroku

- [ ] Phase 8: Testing and Verification
  - [ ] Test form submission
  - [ ] Verify page rendering
  - [ ] Check responsiveness

## Resources and References

- Express.js documentation: https://expressjs.com/
- Heroku Node.js deployment: https://devcenter.heroku.com/articles/deploying-nodejs
- Heroku PostgreSQL: https://devcenter.heroku.com/articles/heroku-postgresql
- PostgreSQL Node.js client: https://node-postgres.com/
