# Google Drive Integration Setup Guide

This document explains how to set up the Google Drive integration for Revelate Operations website's contact form and assessment tool.

## Prerequisites

- Google account with access to Google Cloud Platform
- Google Drive where you want to store data
- Basic understanding of Google Sheets

## Setup Steps

### 1. Set Up Google Sheets

1. Create two Google Sheets documents in your Google Drive:
   - **Contact Sheet**: For storing contact form submissions
   - **Assessment Sheet**: For storing assessment data

2. For the **Contact Sheet**, create the following columns:
   - Timestamp
   - Name
   - Email
   - Phone
   - Company
   - Interest
   - Message
   - Source

3. For the **Assessment Sheet**, create the following columns:
   - Timestamp
   - Full Name
   - Email
   - Company Name
   - Job Title
   - Industry
   - Company Size
   - Data Infrastructure Score
   - Analytics Score
   - Process Score
   - Team Score
   - Overall Score
   - Maturity Level
   - And additional columns for each individual question response

4. Once created, copy the Spreadsheet IDs from the URL of each sheet.
   - The URL looks like: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the SPREADSHEET_ID part for both sheets

### 2. Configure Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com)
2. Access your "RevelateOps Website" project
3. Navigate to "APIs & Services" > "Credentials"
4. Create an OAuth 2.0 Client ID:
   - Go to "Create Credentials" > "OAuth client ID"
   - Choose "Web application" as the application type
   - Add your website domain to the "Authorized JavaScript origins"
   - No need to add redirect URIs since we're using implicit flow
   - Click "Create"
   - Copy the generated Client ID

5. Create an API Key:
   - Go to "Create Credentials" > "API Key"
   - Restrict the API key to only Google Sheets and Drive APIs
   - Add your website domain as a HTTP referrer restriction
   - Copy the generated API Key

### 3. Update Website Code

1. Open the file `/assets/js/google-drive-api.js`
2. Replace the placeholder values:
   ```javascript
   // Replace these with your actual credentials
   const CLIENT_ID = 'YOUR_CLIENT_ID_HERE'; // Paste your OAuth Client ID here
   const API_KEY = 'YOUR_API_KEY_HERE'; // Paste your API Key here
   
   // Replace these with your actual spreadsheet IDs
   const CONTACTS_SPREADSHEET_ID = 'YOUR_CONTACTS_SPREADSHEET_ID'; // Paste your Contact sheet ID
   const ASSESSMENT_SPREADSHEET_ID = 'YOUR_ASSESSMENT_SPREADSHEET_ID'; // Paste your Assessment sheet ID
   ```

### 4. Test the Integration

1. Publish your website with the updated files
2. Fill out the contact form and submit
3. Fill out the assessment form and submit
4. Check your Google Sheets to verify that the data has been added correctly

## Troubleshooting

- **Authentication Issues**: If you see authentication errors, ensure your OAuth consent screen is configured correctly
- **Permission Issues**: Make sure the sheets are editable by anyone with the link, or by authenticated users
- **CORS Issues**: Verify your allowed origins in the Google Cloud Console

## Security Considerations

- The API key and Client ID are visible in the client-side JavaScript. This is normal for web applications
- The integration is configured to only access specific Google Sheets from specific domains
- For additional security, you can implement a backend service to handle the Google Drive integration

## Support

If you encounter any issues with the integration, please contact your developer or refer to the [Google Sheets API documentation](https://developers.google.com/sheets/api) for more information.