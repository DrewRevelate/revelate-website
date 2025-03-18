# Revelate Operations Website

Modern website for Revelate Operations, built with Node.js, Express, and EJS.

## Features

- Responsive design optimized for all devices
- Progressive Web App capabilities
- Server-side rendering for SEO optimization
- Optimized asset delivery with proper caching
- Database integration for dynamic content
- Contact form with validation
- Analytics integration

## Development

### Prerequisites

- Node.js 18.x
- PostgreSQL (for production and optional for development)

### Setup

```bash
# Clone the repository
git clone https://github.com/DrewRevelate/revelate-website.git
cd revelate-website

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run in development mode
npm run dev
```

### Database Setup

For production or if using database features in development:

```bash
# Create the database tables
npm run setup-db
```

## Deployment

The site is deployed on Heroku with the following configuration:

```bash
# Deploy to Heroku
git push heroku main

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=your-secret-key
```

## Project Structure

```
├── public/             # Static assets
│   ├── assets/         # CSS, JS, images
│   ├── manifest.json   # PWA manifest
│   └── service-worker.js # Service worker for offline support
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   ├── models/         # Database models
│   ├── routes/         # Express routes
│   ├── scripts/        # Utility scripts
│   ├── utils/          # Helper utilities
│   ├── views/          # EJS templates
│   └── app.js          # Express app setup
├── .env                # Environment variables
├── .gitignore          # Git ignore file
├── package.json        # Dependencies
├── Procfile            # Heroku deployment
├── README.md           # Documentation
└── server.js           # Entry point
```

## License

MIT
