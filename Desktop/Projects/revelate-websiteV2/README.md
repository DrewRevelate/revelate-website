# Revelate Operations Website

A modern, responsive website for Revelate Operations, LLC - a SaaS consulting and revenue operations company.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Getting Started](#getting-started)
5. [Directory Structure](#directory-structure)
6. [Sanity CMS Integration](#sanity-cms-integration)
7. [Deployment](#deployment)
8. [Dark Mode](#dark-mode)
9. [Contact Form](#contact-form)
10. [Performance Optimizations](#performance-optimizations)
11. [License](#license)

## Overview

This repository contains a fully functional website for Revelate Operations, LLC, featuring a public-facing marketing site with modern design elements, responsive layout, and CMS integration. The website is built to be secure, scalable, and visually appealing.

## Features

- **Responsive Design**: Optimized for all device sizes
- **Dark Mode Support**: Toggle between light and dark themes
- **Sanity CMS Integration**: Content management for images and other content
- **Contact Form**: Form submissions stored in PostgreSQL database
- **Newsletter Subscription**: Email collection for marketing
- **Case Studies**: Showcase client success stories
- **Team Profiles**: Highlight team members and expertise
- **Service Descriptions**: Detailed service offerings
- **Performance Optimized**: Fast loading and optimized assets
- **SEO Ready**: Proper meta tags, sitemap, and robots.txt

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js with Express.js
- **View Engine**: EJS templates
- **Database**: PostgreSQL
- **CMS**: Sanity.io
- **Deployment**: Vercel for website, Heroku for API
- **Performance**: Compression, caching, and optimized assets
- **Security**: Helmet.js for secure headers

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL database
- Sanity.io account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/revelate-operations-website.git
   cd revelate-operations-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Initialize the database:
   ```bash
   npm run setup-db
   ```

5. Set up Sanity Studio:
   ```bash
   cd sanity-studio
   npm install
   ```

6. Initialize Sanity with sample data:
   ```bash
   npm run init-sanity
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

8. Start Sanity Studio (in a separate terminal):
   ```bash
   cd sanity-studio
   npm run dev
   ```

## Directory Structure

```
revelate-operations-website/
├── assets/                   # Static assets
│   ├── css/                  # Stylesheets
│   ├── js/                   # JavaScript files
│   ├── images/               # Images and icons
├── sanity-studio/            # Sanity CMS studio
├── src/
│   ├── config/               # Configuration files
│   │   └── database.js       # PostgreSQL connection
│   ├── middleware/           # Express middleware
│   │   └── sanityMiddleware.js # Sanity integration middleware
│   ├── routes/               # Express routes
│   │   ├── api.js            # API endpoints
│   │   └── pages.js          # Page rendering routes
│   ├── sanity/               # Sanity client and schemas
│   │   ├── client.js         # Sanity client configuration
│   │   └── schemas/          # Content type schemas
│   ├── scripts/              # Utility scripts
│   │   └── init-sanity.js    # Sanity initialization script
│   ├── utils/                # Utility functions
│   │   ├── sanityUtils.js    # Sanity helper functions
│   │   └── validation.js     # Form validation
│   ├── views/                # EJS templates
│   │   ├── layouts/          # Layout templates
│   │   ├── pages/            # Page templates
│   │   └── partials/         # Reusable components
│   └── app.js                # Express application
├── .env                      # Environment variables
├── package.json              # Dependencies and scripts
├── server.js                 # Entry point
```

## Sanity CMS Integration

Sanity CMS is used to manage website content, especially images, team members, case studies, and service information.

### Content Types

- **Site Images**: General-purpose images throughout the website
- **Team Members**: Team profiles with bios and expertise
- **Service Cards**: Service offerings with descriptions
- **Case Studies**: Client success stories and project details

### Usage

1. Start Sanity Studio:
   ```bash
   cd sanity-studio
   npm run dev
   ```

2. Access the studio at http://localhost:3333
3. Add/edit content in the appropriate content types
4. Content will automatically update on the website

### Image Handling

Images are managed through Sanity's CDN, which provides:
- Automatic responsive image sizing
- Format optimization
- Lazy loading
- Dark mode variants

To use Sanity images in templates:

```ejs
<%- include('../partials/sanity-image', {
    identifier: 'image-identifier',
    alt: 'Alt text',
    className: 'optional-css-class',
    fallbackSrc: '/path/to/fallback.jpg' // Used if Sanity image isn't available
}) %>
```

## Deployment

### Vercel Deployment

1. Connect your Vercel account to your GitHub repository
2. Configure environment variables in Vercel dashboard
3. Deploy from the main branch

### Heroku Deployment (for API and database)

1. Create a Heroku app:
   ```bash
   heroku create revelate-operations-api
   ```

2. Add PostgreSQL add-on:
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

3. Configure environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SANITY_PROJECT_ID=your-project-id
   heroku config:set SANITY_DATASET=production
   ```

4. Deploy to Heroku:
   ```bash
   git push heroku main
   ```

## Dark Mode

The website includes dark mode support that can be toggled by the user. The system:

- Respects user's system preferences
- Saves user preference in localStorage
- Includes separate stylesheets for dark/light modes
- Supports dark mode variants of images in Sanity

## Contact Form

The contact form submits data to a PostgreSQL database via an API endpoint:

- Form validation on both client and server
- Spam detection and prevention
- CSRF protection
- UTM parameter tracking
- IP tracking for analytics

## Performance Optimizations

- Compressed responses with gzip/Brotli
- Optimized image loading and responsive sizing
- Proper cache headers for static assets
- Critical CSS inlined
- Lazy loading of images and non-critical content
- Minified CSS and JavaScript in production

## License

MIT License - see LICENSE file for details.
