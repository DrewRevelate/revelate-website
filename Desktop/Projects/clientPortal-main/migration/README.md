# RevelateOps Client Portal Migration

This directory contains scripts for migrating data from CSV files to the Supabase database for the RevelateOps Client Portal.

## Prerequisites

- Node.js 16+ installed
- Supabase project set up
- CSV files available at the specified location

## Setup

1. Install dependencies:

```bash
cd migration
npm install
```

2. Make sure the `.env` file is present with your Supabase service key:

```
SUPABASE_SERVICE_KEY=your-service-key
```

3. Make sure the CSV files are in the correct location (currently set to `/Users/drewlambert/Desktop/`):
   - Project Management - Accounts.csv
   - Project Management - Contacts.csv
   - Project Management - Projects.csv
   - Project Management - Tasks.csv
   - Project Management - Meetings.csv
   - Project Management - Documents.csv
   - Project Management - Client Purchases.csv
   - Project Management - Schedule Links.csv

## Running the Migration

Apply the database schema updates first:

```bash
npx supabase db push
```

Then run the migration script:

```bash
npm run migrate
```

The script will:
1. Migrate accounts/companies
2. Migrate users/profiles
3. Migrate projects
4. Migrate tasks
5. Migrate meetings
6. Migrate documents
7. Migrate time packages
8. Migrate schedule links

## Troubleshooting

If you encounter errors during migration:

1. Check the console output for specific error messages
2. Verify that all CSV files are in the correct location
3. Confirm that the Supabase schema has been properly updated
4. Make sure your Supabase service key has the necessary permissions

## Post-Migration Steps

After the migration completes:

1. Verify the data in the Supabase dashboard
2. Update any references in your code to match the new data structure
3. Set up user authentication for clients
