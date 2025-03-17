# Revelate Operations Website

A modern, responsive website for Revelate Operations, a data-driven SaaS consulting firm specializing in CRM management, business intelligence, and revenue operations. This site is built using Node.js, Express, and EJS templating with PostgreSQL database integration.

## Project Overview

This website is designed to showcase Revelate Operations' services, expertise, and case studies in the SaaS consulting space. It features a clean, professional design with modern animations and interactive elements to engage visitors.

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Templating**: EJS with layouts and partials
- **Database**: PostgreSQL (for contact form and assessment data)
- **Deployment**: Heroku
- **Additional**: PWA capabilities, RevOps presentation project

## File Structure

```
revelate-website/
├── assets/                   # Static assets
│   ├── css/                  # CSS files
│   ├── images/               # Image assets
│   └── js/                   # JavaScript files
├── db/                       # Database migrations and schema
│   └── migrations/           # SQL migration files
├── images/                   # Content images (case studies, testimonials, etc.)
├── RevOps_Presentation-main/ # Industries Day interactive presentation
├── src/                      # Application source code
│   ├── config/               # Configuration files
│   │   └── database.js       # Database configuration
│   ├── controllers/          # Route controllers (if needed)
│   ├── models/               # Database models
│   ├── routes/               # Express routes
│   │   ├── api.js            # API routes
│   │   └── pages.js          # Page rendering routes
│   ├── scripts/              # Utility scripts
│   │   └── setup-db.js       # Database setup script
│   ├── utils/                # Utility functions
│   │   ├── expressEjsLayouts.js # EJS layout middleware
│   │   └── validation.js        # Form validation
│   ├── views/                # EJS templates
│   │   ├── layouts/          # Layout templates
│   │   ├── pages/            # Page templates
│   │   │   ├── case-studies/ # Case study templates
│   │   │   └── projects/     # Project templates
│   │   └── partials/         # Reusable components
│   └── app.js                # Main application entry point
├── .env                      # Environment variables (not in repo)
├── server.js                 # Server entry point for Heroku
├── service-worker.js         # Service worker for PWA capabilities
└── package.json              # Project dependencies and scripts
```

## Features

- **Express.js Backend**: Server-side rendering for improved SEO and performance
- **PostgreSQL Integration**: Database for storing form submissions and assessment data
- **RESTful API**: Endpoints for contact form, assessment tool, and status checks
- **Interactive RevOps Assessment**: Tool to evaluate users' Revenue Operations maturity
- **Case Studies Section**: Showcase of client success stories with detailed metrics
- **Industries Day Project**: Interactive presentation on RevOps and automation
- **Responsive Design**: Fully responsive layout for all device sizes
- **Modern UI Elements**: Animations, testimonial sliders, and interactive components
- **Performance Optimized**: Compression, caching, and efficient asset loading
- **SEO Ready**: Proper meta tags, structured data, and semantic HTML

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/revelate-website.git
   cd revelate-website
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up your environment variables in a `.env` file:
   ```
   DATABASE_URL=postgres://username:password@localhost:5432/revelate
   PORT=3000
   ```

4. Set up the database
   ```
   npm run setup-db
   ```

5. Start the development server
   ```
   npm run dev
   ```

The site will be available at http://localhost:3000

## API Endpoints

The application provides the following API endpoints:

- `POST /api/contacts`: Submit contact form information
- `POST /api/assessments`: Submit RevOps assessment data
- `GET /api/status`: Check API and database connection status

## Heroku Deployment

The website is configured for Heroku deployment:

1. Create a Heroku app and add the PostgreSQL addon:
   ```
   heroku create revelate-operations
   heroku addons:create heroku-postgresql:hobby-dev
   ```

2. Deploy using the included script:
   ```
   ./deploy.sh
   ```

Or manually:

1. Push to Heroku:
   ```
   git push heroku main
   ```

2. Run the database setup:
   ```
   heroku run npm run setup-db
   ```

## Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with hot-reloading
- `npm run setup-db`: Set up the database tables
- `npm run lint`: Run ESLint to check code quality

## License

All rights reserved. This code is proprietary to Revelate Operations.
