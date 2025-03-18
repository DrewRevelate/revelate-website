# Revelate Website Rebuild

This branch contains a complete rebuild of the Revelate Operations website with significant improvements for performance, SEO, and maintainability.

## Key Improvements

### Architecture Improvements
- **Node.js/Express Backend**: Replaced the previous static site with a more flexible Node.js/Express architecture
- **MVC Pattern**: Implemented a clear Model-View-Controller pattern for better code organization
- **EJS Templating**: Added EJS templates with reusable layouts and partials
- **PostgreSQL Database**: Integrated PostgreSQL for storing form submissions, user data, and content

### Performance Enhancements
- **Optimized Asset Loading**: Improved asset loading with proper caching headers and preloading of critical resources
- **Compression**: Added compression middleware for faster page delivery
- **Progressive Web App**: Implemented service worker and manifest.json for offline capabilities
- **Responsive Images**: Optimized images with responsive sizing and proper formats

### SEO & Accessibility
- **Semantic HTML**: Improved markup with proper semantic elements
- **Metadata**: Enhanced metadata including OpenGraph and Twitter Card support
- **Sitemap & Robots.txt**: Added comprehensive sitemap.xml and robots.txt files
- **Accessibility**: Improved keyboard navigation, screen reader support, and ARIA attributes
- **Structured Data**: Added JSON-LD structured data for better search engine visibility

### Security & Best Practices
- **Helmet Integration**: Added Helmet.js for security headers
- **Input Sanitization**: Implemented comprehensive input validation and sanitization
- **Rate Limiting**: Added rate limiting middleware to prevent abuse
- **Error Handling**: Implemented centralized error handling with appropriate user messaging
- **CSRF Protection**: Added CSRF protection for form submissions

### User Experience Improvements
- **Mobile-First Design**: Rebuilt UI with a mobile-first approach
- **Enhanced Animations**: Added subtle animations and transitions for better user engagement
- **Form Validation**: Improved client-side form validation with better feedback
- **Cookie Consent**: Added GDPR-compliant cookie consent banner
- **Improved Navigation**: Enhanced mobile navigation with better touch support

## Technical Implementation Details

### File Structure

The application follows a clear structure with separation of concerns:

```
revelate-website/
├── public/                   # Static assets
│   ├── assets/               # Compiled assets
│   │   ├── css/              # CSS files
│   │   ├── js/               # JavaScript files
│   │   └── images/           # Image files
│   ├── service-worker.js     # Service worker for offline support
│   ├── manifest.json         # PWA manifest
│   └── robots.txt            # Robots file
├── src/                      # Application source code
│   ├── config/               # Configuration files
│   ├── controllers/          # Route controllers
│   ├── models/               # Database models
│   ├── routes/               # Route definitions
│   ├── scripts/              # Utility scripts
│   ├── utils/                # Helper utilities
│   ├── middleware/           # Custom middleware
│   ├── views/                # EJS templates
│   │   ├── layouts/          # Layout templates
│   │   ├── pages/            # Page templates
│   │   └── partials/         # Reusable components
│   └── app.js                # Application entry point
├── server.js                 # Server entry point
└── package.json              # Dependencies and scripts
```

### Technology Stack
- **Backend**: Node.js v18, Express.js
- **Database**: PostgreSQL 
- **View Engine**: EJS (Embedded JavaScript Templates)
- **CSS**: Custom CSS with variables (no framework)
- **JavaScript**: Vanilla JS with modular organization
- **Deployment**: Heroku-ready configuration

## Deployment

The application is ready to be deployed on Heroku:

1. Create a Heroku app
2. Provision a PostgreSQL database
3. Set environment variables
4. Deploy with the `deploy.sh` script or directly via Git

```bash
./deploy.sh production
```

Perform database migration:

```bash
heroku run npm run setup-db --app revelate-operations
```

## Testing Locally

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up local PostgreSQL database 
4. Create `.env` file with required variables
5. Run development server: `npm run dev`
6. Visit `http://localhost:3000`

## Next Steps / Future Improvements

- Implement admin dashboard for content management
- Add blog/resources section
- Integrate with email marketing provider
- Implement more advanced analytics
- Add A/B testing capabilities
- Develop more case studies and project showcases

---

© 2025 Revelate Operations, LLC. All rights reserved.