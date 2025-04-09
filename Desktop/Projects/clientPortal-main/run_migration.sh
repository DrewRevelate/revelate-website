#!/bin/bash

# First fix the JWT secret issue in any migration files
sed -i'' -e 's/ALTER DATABASE postgres SET "app.jwt_secret" TO/-- ALTER DATABASE postgres SET "app.jwt_secret" TO/' /Users/drewlambert/Desktop/Projects/client-portal/supabase/migrations/00000000000000_initial_schema.sql

# Add and commit the changes
git add .
git commit -m "Fix database migration issues"
git push

# Run the migrations using connection pooler (transaction mode)
echo "Using connection pooler: postgresql://postgres.ynkuozdffpsogpziaize:Abl119rfdmnh03055!@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
supabase db push --db-url "postgresql://postgres.ynkuozdffpsogpziaize:Abl119rfdmnh03055!@aws-0-us-east-1.pooler.supabase.com:6543/postgres" --debug
