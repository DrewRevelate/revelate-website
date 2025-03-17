# Full Throttle Revenue Presentation

An interactive presentation on Revenue Operations (RevOps) and Sales Automation for college business undergraduates. This web application is continuously deployed on Heroku with a PostgreSQL database, featuring interactive polls, a contact submission form, and a mini-CRM system to track user engagement.

## Current Status (Updated March 2025)

This project is continuously running on Heroku at: [https://revops-presentation.herokuapp.com/](https://revops-presentation.herokuapp.com/)

**Latest Updates:**
- Implemented unified CRM system linking contacts and polls
- Fixed poll response behavior to hide options after submission
- Added IP-based user tracking for anonymous visitors
- Enhanced admin dashboard with real-time data visualization

### Required Changes (Priority)
- **Unify Admin and CRM interfaces**: Currently, the admin portal and CRM system are separated, with the CRM functioning as a sub-section of admin. These should be integrated into a single, cohesive interface with unified functionality.

## Features

- Interactive slides with real-time polls and result visualization
- Contact form for attendees to submit their information
- Secure admin portal for managing contacts and poll data
- Mini-CRM system for tracking user engagement
- Responsive design optimized for all devices
- Local development (SQLite) and production (PostgreSQL) environments
- Automated Heroku deployment with database migrations

## Mini-CRM System Architecture

The presentation includes a mini-CRM (Customer Relationship Management) system that:

1. **Tracks User Interactions**:
   - Automatically creates contact records with unique IDs based on user IP addresses
   - Records poll responses and links them to contact records
   - Provides full CRUD operations through the admin portal

2. **Relationship Management**:
   - Each user gets a unique ID generated from their IP address hash
   - Contact submissions are linked to poll responses
   - If a user submits the contact form, their poll responses are associated with their contact record

3. **Poll Functionality**:
   - Allows one vote per user per poll
   - If a poll response is deleted, the user can vote again
   - Displays real-time results after voting
   - Hides poll options once a response is submitted

4. **Admin Features**:
   - View and manage all contacts
   - View all poll responses with filtering options
   - Delete poll responses to allow users to vote again
   - Export contact and poll data
   - View relationships between contacts and poll responses

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (production), SQLite (development)
- **Deployment**: Heroku
- **Authentication**: JWT (JSON Web Tokens)

## Installation and Setup

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/DrewRevelate/RevOps_Presentation.git
   cd RevOps_Presentation
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   JWT_SECRET=your_jwt_secret
   ADMIN_PASSWORD=your_admin_password
   ```

4. Run database migrations:
   ```
   npm run migrate
   npm run migrate:crm
   npm run migrate:unified
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Access the application at http://localhost:3000

### Heroku Deployment

This application is designed to run continuously on Heroku. To deploy or update:

1. Ensure you have the Heroku CLI installed and you're logged in:
   ```
   heroku login
   ```

2. Connect to the existing Heroku app or create a new one:
   ```
   # For existing app
   heroku git:remote -a revops-presentation
   
   # For new app
   heroku create revops-presentation
   ```

3. Add PostgreSQL if not already present:
   ```
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. Set required environment variables:
   ```
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set ADMIN_PASSWORD=your_admin_password
   ```

5. Deploy to Heroku:
   ```
   git push heroku main
   ```

6. Run migrations automatically:
   The application will automatically run all necessary migrations during the Heroku post-build process.

7. Open the application:
   ```
   heroku open
   ```

## Database Migrations

The application uses a migration system that automatically handles database schema changes:

```
# Run all migrations locally
npm run migrate       # Base schema
npm run migrate:crm   # CRM upgrade migration
npm run migrate:unified  # Unified system migration (links contacts and polls)
```

**Note**: When deploying to Heroku, all migrations run automatically during the build process.

## Admin Portal Access

Access the admin portal at `/admin.html`. Use the admin password set in your environment variables to log in.

The admin portal provides access to:
- Contact management
- Poll results and management
- Data export functionality
- CRM system with relationship visualization

## Data Structure and Relationships

### Contacts
- Each user gets a unique ID (`unique_id`) based on their IP address hash
- Contact submissions include:
  - Name, email, and other optional fields
  - IP hash for anonymous tracking
  - Timestamp and metadata
- Anonymous contacts exist for users who haven't submitted the form

### Polls
- Two main polls in the presentation:
  - Revenue Acceleration Poll (slide 3)
  - Sales Skills Poll (slide 6)
- Poll responses are linked to contacts via `user_id` and `ip_hash`
- One vote per user per poll, unless response is deleted by admin

### Database Schema
- `contact_submissions`: Stores all contact form submissions
- `poll_definitions`: Defines available polls
- `poll_options`: Options for each poll
- `poll_responses`: User responses to polls
- `poll_response_options`: Links responses to selected options

## Continuous Improvement Notes

For future Claude sessions or developers working on this project:

1. Always read this README file first to understand the current state
2. Update this README when making significant changes
3. The mini-CRM system is designed to be extensible
4. All code changes should maintain the relationship between contacts and polls
5. Heroku deployment should be maintained for continuous availability

## UI Integration Task: Unifying Admin and CRM Interfaces

The next major improvement needed is to unify the currently separate admin portal and CRM system into a single, integrated interface. This task involves:

### Current Architecture

- `/admin.html`: Main admin dashboard - primarily focused on poll management
  - Route: `GET /admin/`
  - Features: Poll data, Contact form data, Export functionality
  - Links to CRM as a separate section

- `/views/admin-crm.html`: CRM dashboard - focused on contact management
  - Route: `GET /admin/crm`
  - Features: Contact management, relationship visualization, tags
  - Links back to the main admin dashboard

### Required Changes

1. **UI Integration**:
   - Create a new unified admin interface that combines both dashboards
   - Consolidate styles from both interfaces (currently using different CSS classes)
   - Restructure navigation to include all functionality in a single sidebar

2. **Functionality Consolidation**:
   - Merge poll management and contact management into a single interface
   - Ensure all current features remain accessible
   - Improve data visualization to show relationships between polls and contacts

3. **Backend Routes**:
   - Consolidate relevant routes in `routes/admin.js`
   - Create a new main admin view that replaces both current views
   - Update all API endpoints to work with the new unified interface

4. **Implementation Steps**:
   - Create a new HTML template for the unified interface
   - Combine CSS styles from both interfaces (`.admin-*` and `.crm-*`)
   - Restructure the JavaScript for both interfaces into a single file
   - Update routes to serve the new unified interface
   - Test thoroughly to ensure no functionality is lost

5. **Key Files to Modify**:
   - `/admin.html` (main admin interface)
   - `/views/admin-crm.html` (CRM interface)
   - `/admin-ui.js` (admin JavaScript)
   - `/routes/admin.js` (backend routes)
   - Create a new unified template and JavaScript file

No functionality should be removed during this process - this is purely a UI integration task to improve user experience by providing a single, cohesive admin interface instead of two separate ones.

## License

MIT