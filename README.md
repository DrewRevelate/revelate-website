# Revelate Operations Website

A modern, responsive website for Revelate Operations, a SaaS consulting business specializing in Salesforce and Sales Engineering.

## Project Overview

This website is designed to showcase Revelate Operations' services, expertise, and case studies in the SaaS consulting space. It features a clean, professional design with modern animations and interactive elements to engage visitors.

## File Structure

The project follows a standard file structure for a static website:

```
revelate-operations/
│
├── index.html              # Home page
├── services.html           # Services page
├── approach.html           # Our Approach page
├── about.html              # About Us page
├── contact.html            # Contact page
│
├── case-studies/           # Case studies directory
│   ├── index.html          # Case studies listing page
│   ├── case-study-1.html   # Individual case study
│   ├── case-study-2.html
│   └── ...
│
├── css/                    # CSS files
│   ├── main.css            # Main stylesheet
│   ├── home.css            # Home page specific styles
│   ├── notifications.css   # Notification system styles
│   └── ...
│
├── js/                     # JavaScript files
│   ├── main.js             # Main JavaScript functionality
│   ├── animations.js       # Animation handling
│   ├── testimonials.js     # Testimonial slider
│   ├── portal.js           # Client portal functionality
│   └── ...
│
└── images/                 # Image directory
    ├── revelate-spiral-logo.png   # Logo
    ├── dashboard-illustration.svg # Hero illustration
    ├── expertise-illustration.svg # Expertise section illustration
    ├── clients/            # Client logos
    ├── testimonials/       # Testimonial author photos
    └── case-studies/       # Case study images
```

## Features

- **Responsive Design**: The website is fully responsive and works on all device sizes
- **Modern Animations**: Subtle animations enhance the user experience without being distracting
- **Interactive Elements**: Service cards expand to show more details, testimonial carousels, etc.
- **Client Portal Integration**: Ready for integration with a future client portal system
- **Performance Optimized**: Fast loading with efficient CSS and JavaScript
- **Accessibility Focused**: Meets WCAG guidelines for accessibility
- **SEO Ready**: Proper meta tags, structured data, and semantic HTML

## Technical Details

### CSS Architecture

The CSS follows a component-based architecture with a main stylesheet (`main.css`) that contains global styles, variables, and utility classes. Page-specific styles are separated into their own files for maintainability.

CSS features include:
- Custom properties (CSS variables) for consistent theming
- Responsive grid layouts using CSS Grid and Flexbox
- Mobile-first responsive design
- Performant animations and transitions

### JavaScript Architecture

The JavaScript is organized into modular files based on functionality:

- `main.js`: Core functionality shared across all pages
- `animations.js`: Handles scroll-based animations and counters
- `testimonials.js`: Controls the testimonial slider component
- `portal.js`: Manages the client portal login modal

### Future Integration Points

The website is designed to easily integrate with:

1. **Client Portal System**: The login modal is already set up and can be connected to a backend authentication system
2. **CMS**: Content can be moved to a headless CMS with minimal changes to the frontend
3. **Analytics**: Built with clean event hooks for analytics implementation

## Getting Started

1. Clone the repository
2. Open `index.html` in your browser to view the site locally
3. Make changes to HTML, CSS, or JavaScript files as needed

## Browser Support

The website is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- iOS Safari
- Android Chrome

## Development

### Prerequisites

- Basic knowledge of HTML, CSS, and JavaScript
- A code editor (VS Code recommended)
- Git for version control

### Making Changes

1. Create a new branch for your changes
2. Make your edits to the appropriate files
3. Test changes on various device sizes
4. Commit your changes and create a pull request

## Deployment

### GitHub Pages
This website is primarily configured for GitHub Pages deployment with the following steps:
1. Ensure your repository is configured for GitHub Pages in Settings
2. Push changes to the main branch
3. GitHub Actions will build and deploy the site automatically

### Heroku Deployment
The website is also configured for Heroku deployment:

1. Create a Heroku app: `heroku create revelate-operations`
2. Add Ruby buildpack: `heroku buildpacks:add heroku/ruby`
3. Configure _config.yml for Heroku (empty baseurl)
4. Push to Heroku: `git push heroku main`

### Local Development
For local development:

1. Install Ruby and Bundler
2. Run `bundle install` to install dependencies
3. Start Jekyll server: `bundle exec jekyll serve`
4. Visit http://localhost:4000 in your browser

### Other Deployment Options
The website can also be deployed to other providers:

1. Netlify
2. Vercel
3. AWS S3 + CloudFront

## License

All rights reserved. This code is proprietary to Revelate Operations.
