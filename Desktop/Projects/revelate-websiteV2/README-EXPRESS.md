# Revelate Operations Website

A modern, responsive website for Revelate Operations, a data-driven SaaS consulting firm specializing in CRM management, business intelligence, and revenue operations. This site is built using Node.js, Express, and EJS templating with PostgreSQL database integration.

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Templating**: EJS with layouts and partials
- **Database**: PostgreSQL (for contact form and assessment data)
- **Deployment**: Heroku
- **Additional**: PWA capabilities

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/DrewRevelate/revelate-website.git
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
- `GET /api/status`: Check API and database connection status

## Deployment

The website is configured for Heroku deployment:

1. Connect your GitHub repository to Heroku
2. Add the PostgreSQL addon:
   ```
   heroku addons:create heroku-postgresql:hobby-dev
   ```

3. Deploy using Heroku's GitHub integration

## Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with hot-reloading
- `npm run setup-db`: Set up the database tables

## License

All rights reserved. This code is proprietary to Revelate Operations.
