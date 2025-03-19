# Revelate Operations Website

A modern, responsive website for Revelate Operations, LLC, a SaaS consulting and revenue operations company.

## Overview

This is a fully functional website built with Node.js, Express, and EJS templates. It features:

- Responsive design for all devices
- Modern, clean UI with intuitive navigation
- Interactive elements and animations
- Optimized performance and SEO
- Contact form with data collection
- Client portal integration

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express
- **Templating**: EJS
- **Hosting**: Heroku
- **Version Control**: Git/GitHub

## Project Structure

```
revelate-website/
├── assets/                 # Static assets
│   ├── css/                # Stylesheets
│   ├── images/             # Image files
│   └── js/                 # JavaScript files
├── src/                    # Source code
│   ├── config/             # Configuration files
│   ├── routes/             # Express routes
│   ├── utils/              # Utility functions
│   └── views/              # EJS templates
│       ├── layouts/        # Page layouts
│       ├── pages/          # Page content
│       └── partials/       # Reusable components
├── Procfile                # Heroku configuration
├── package.json            # Dependencies
├── server.js               # Main server file
└── deploy.sh               # Deployment script
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm (v6+)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DrewRevelate/revelate-website.git
   cd revelate-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Deployment

The website is configured for easy deployment to Heroku. 

### Using the Deployment Script

1. Make your changes to the website
2. Run the deployment script:
   ```bash
   ./deploy.sh
   ```
3. Enter a commit message when prompted
4. The script will commit your changes, push to GitHub, and deploy to Heroku

### Manual Deployment

#### Heroku

1. Login to Heroku:
   ```bash
   heroku login
   ```

2. Create a Heroku app (if not already created):
   ```bash
   heroku create revelate-operations
   ```

3. Deploy:
   ```bash
   git push heroku main
   ```

#### GitHub

1. Push to GitHub:
   ```bash
   git push origin main
   ```

## Customization

### Adding New Pages

1. Create a new EJS template in the `src/views/pages/` directory
2. Add the route in `src/routes/pages.js`
3. Create any necessary CSS in `assets/css/`

### Modifying the Header or Footer

1. Edit the templates in `src/views/partials/navigation.ejs` and `src/views/partials/footer.ejs`
2. Update the styles in `assets/css/header-footer.css`

## Maintenance and Updates

To keep the website current:

1. Regularly update npm packages:
   ```bash
   npm update
   ```

2. Monitor Heroku logs for any issues:
   ```bash
   heroku logs --tail
   ```

3. Keep content fresh with regular updates to case studies, team information, and service offerings

## License

This project is proprietary and confidential. All rights reserved by Revelate Operations, LLC.

## Contact

For any questions or support, please contact:
- Drew Lambert: [LinkedIn](https://www.linkedin.com/in/drewblambert/)
- Melanie Tummino: [LinkedIn](https://www.linkedin.com/in/melanietummino/)
