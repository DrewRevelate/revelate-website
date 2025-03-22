# Revelate Operations Sanity Studio

This is the content management system (CMS) for Revelate Operations' website, built using [Sanity.io](https://www.sanity.io/).

## Getting Started

1. Install the dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Your studio will be available at `http://localhost:3333`

## Managing Content

### Website Images

Use the "Website Images" document type to manage all images used throughout the website. Each image should have:

- A descriptive name
- A category (e.g., "Hero Images", "About Page")
- A unique identifier that will be used to reference this image in code
- The image file
- Alternative text for accessibility and SEO
- Optional: A dark mode variant of the image

### Team Members

Manage team member profiles, including:

- Name and role
- Biography (full and short version)
- Photo
- Areas of expertise
- Credentials
- Social media links

### Service Cards

Define the services offered by Revelate Operations:

- Title and description
- Icons or images
- Key features
- Category
- Related services

### Case Studies

Create case studies showcasing successful client projects:

- Title and client
- Industry and services applied
- Challenge, solution, and results
- Metrics and testimonials
- Cover image and additional images

## Deployment

To deploy the studio to Sanity's servers:

```bash
npm run deploy
```

## GraphQL API

To deploy the GraphQL API:

```bash
npm run deploy-graphql
```

## Further Documentation

- [Sanity Documentation](https://www.sanity.io/docs)
- [Content Studio Documentation](https://www.sanity.io/docs/sanity-studio)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
