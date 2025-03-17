# Revelate Operations Website

A modern, responsive website for Revelate Operations, a SaaS consulting business specializing in Salesforce and Sales Engineering. This site has been rebuilt using Node.js, Express, and EJS templating.

## Project Overview

This website is designed to showcase Revelate Operations' services, expertise, and case studies in the SaaS consulting space. It features a clean, professional design with modern animations and interactive elements to engage visitors.

## Architecture

The application has been rebuilt using a modern Node.js/Express architecture with the following components:

- **Express.js**: Backend web framework for routing and API endpoints
- **EJS**: Template engine with layout support for rendering pages
- **PostgreSQL**: Database for storing contact form submissions and assessment data
- **Custom Assets**: CSS, JavaScript, and images organized for optimal performance

## File Structure

```
revelate-website/
├── assets/             # Static assets
│   ├── css/            # CSS files
│   ├── images/         # Image assets
│   └── js/             # JavaScript files
├── db/                 # Database migrations and schema
│   └── migrations/     # SQL migration files
├── images/             # Content images (case studies, testimonials, etc.)
├── src/                # Application source code
│   ├── config/         # Configuration files
│   │   └── database.js # Database configuration
│   ├── controllers/    # Route controllers (if needed)
│   ├── models/         # Database models
│   ├── routes/         # Express routes
│   │   ├── api.js      # API routes
│   │   └── pages.js    # Page rendering routes
│   ├── scripts/        # Utility scripts
│   │   └── setup-db.js # Database setup script
│   ├── utils/          # Utility functions
│   │   ├── expressEjsLayouts.js # EJS layout middleware
│   │   └── validation.js        # Form validation
│   ├── views/          # EJS templates
│   │   ├── layouts/    # Layout templates
│   │   ├── pages/      # Page templates
│   │   └── partials/   # Reusable components
│   └── app.js          # Main application entry point
├── .env                # Environment variables (not in repo)
├── .env.example        # Environment variables template
└── package.json        # Project dependencies and scripts
```

## Features

- **Node.js Backend**: Server-side rendering for improved SEO and performance
- **Database Integration**: PostgreSQL for storing form submissions and assessment data
- **API Endpoints**: RESTful API for form submissions and data processing
- **Responsive Design**: The website is fully responsive and works on all device sizes
- **Modern Animations**: Subtle animations enhance the user experience
- **Interactive Elements**: Service cards, testimonial carousels, and more
- **Performance Optimized**: Server-side rendering, compression, and caching
- **Accessibility Focused**: Meets WCAG guidelines for accessibility
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

3. Copy the environment file template and edit as needed
   ```
   cp .env.example .env
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

## Production Deployment

For production deployment:

1. Set the appropriate environment variables:
   - `NODE_ENV=production`
   - `DATABASE_URL` (production database URL)
   - Other security-related variables

2. Run the application:
   ```
   npm start
   ```

### Heroku Deployment

The website is configured for Heroku deployment:

1. Create a Heroku app and add the PostgreSQL addon:
   ```
   heroku create revelate-operations
   heroku addons:create heroku-postgresql:hobby-dev
   ```

2. Push to Heroku:
   ```
   git push heroku main
   ```

3. Run the database setup:
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
