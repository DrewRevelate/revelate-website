# Vercel Deployment Guide for Revelate Operations Website

This guide explains how to successfully deploy the Revelate Operations website to Vercel.

## Understanding the Issue

The error that was occurring during deployment was:

```
Error: > Couldn't find any `pages` or `app` directory. Please create one under the project root
```

This happened because Vercel was trying to build the project as a Next.js application, but our website is a static HTML site with Express.js for server functionality.

## Solutions Implemented

We've added several configuration files to ensure Vercel can properly deploy the website:

1. **vercel.json** - Tells Vercel how to handle both static files and server-side code
2. **next.config.js** - A placeholder for Next.js compatibility with static export settings
3. **pages/index.js** - A basic Next.js page that redirects to the main site
4. **static.json** - Configuration for static file hosting
5. **Updated package.json** - Added build scripts for Vercel

## Deployment Steps

1. Make your changes to the website files
2. Run the deploy script:
   ```bash
   ./deploy-to-github.sh
   ```
3. Enter a commit message when prompted
4. The script will push changes to GitHub, which will trigger Vercel deployment

## Monitoring Deployment

1. Go to your Vercel dashboard
2. Select the Revelate Operations project
3. Click on "Deployments" to see deployment status and logs
4. If there are issues, check the build logs for error messages

## Common Issues and Solutions

### Next.js Build Errors

If you see Next.js-related build errors:
- Ensure the `pages` directory exists
- Verify the `next.config.js` file is present
- Check the `vercel.json` file for proper configuration

### Missing Static Assets

If static assets like images, CSS, or JavaScript are not loading:
- Check the `vercel.json` routes configuration
- Ensure all asset directories are included in the builds section
- Verify file paths in HTML files are correct

### Server-Side Functionality Not Working

If server-side features are not working:
- Make sure the Express.js server is correctly configured in `server.js`
- Check that server routes in `vercel.json` are pointing to the correct handler
- Verify environment variables are set in Vercel dashboard

## Sanity CMS Integration

For Sanity CMS integration with Vercel:

1. Add your Sanity project ID to environment variables:
   - In Vercel dashboard, go to Project > Settings > Environment Variables
   - Add `SANITY_PROJECT_ID` with your project ID value
   
2. Set up a deployment webhook:
   - In Vercel dashboard, go to Project > Settings > Git > Deploy Hooks
   - Create a hook named "Sanity Content Update"
   - Copy the generated URL
   - In Sanity dashboard, go to API > Webhooks
   - Add a webhook with the Vercel hook URL to trigger on content changes

## Contact Support

If you continue to face deployment issues, contact:

- Vercel Support: https://vercel.com/support
- Your development team for project-specific assistance
