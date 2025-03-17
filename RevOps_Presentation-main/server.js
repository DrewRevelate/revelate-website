// server.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const { runSqlScript } = require('./db/database');
const { requireAuth, handleLogin, handleLogout } = require('./middleware/auth');

// Load environment variables if available
try {
  require('dotenv').config();
} catch (e) {
  console.log('dotenv not loaded, using process.env variables');
}

// Check if running on Heroku
const isHeroku = process.env.DATABASE_URL ? true : false;

// Only create directories when running locally (not on Heroku)
if (!isHeroku) {
    // Create the necessary directories
    const dirs = [
        path.join(__dirname, 'data'),
        path.join(__dirname, 'exports'),
        path.join(__dirname, 'backups')
    ];

    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    // Initialize database schema if needed (only for SQLite)
    if (!fs.existsSync(path.join(__dirname, 'data', 'presentation.db'))) {
        runSqlScript(path.join(__dirname, 'db', 'schema.sql'));
        console.log('Database schema initialized');
    }
} else {
    // For Heroku, initialize PostgreSQL schema
    console.log('Running on Heroku, initializing PostgreSQL schema...');
    // Run asynchronously since the PostgreSQL version is async
    (async () => {
        try {
            // Use PostgreSQL-specific schema if available
            const pgSchemaPath = path.join(__dirname, 'db', 'schema-pg.sql');
            const schemaPath = path.join(__dirname, 'db', 'schema.sql');
            
            // Check if the PostgreSQL schema exists
            if (fs.existsSync(pgSchemaPath)) {
                await runSqlScript(pgSchemaPath);
                console.log('PostgreSQL schema initialized from schema-pg.sql');
            } else {
                // Fall back to the SQLite schema which will be converted
                await runSqlScript(schemaPath);
                console.log('PostgreSQL schema initialized from schema.sql (converted)');
            }
            
            // Also run the migration to ensure the is_active column exists
            console.log('Running migration to ensure is_active column exists...');
            const migrationPath = path.join(__dirname, 'db', 'migrations', 'add_is_active_column.sql');
            if (fs.existsSync(migrationPath)) {
                try {
                    await runSqlScript(migrationPath);
                    console.log('Successfully ran is_active column migration');
                } catch (migrationErr) {
                    console.error('Error running is_active column migration:', migrationErr);
                }
            } else {
                console.warn('Migration file not found:', migrationPath);
            }
        } catch (err) {
            console.error('Error initializing PostgreSQL schema:', err);
        }
    })();
}

// Import routes
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');
const contactFormRoutes = require('./routes/contact-form');

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for classroom presentations
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow DELETE for clearing poll responses
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname));

// Debug middleware - log all incoming requests with detailed info
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
    console.log(`Request params: ${JSON.stringify(req.params)}`);
    console.log(`Request path: ${req.path}`);
    next();
});

// Authentication routes
app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin-login.html'));
});

app.post('/admin/auth', handleLogin);
app.get('/admin/logout', handleLogout);

// Correctly mount the API routes - no auth required
app.use('/api', apiRoutes);

// Mount contact form routes
app.use('/contact', contactFormRoutes);

// Correctly mount admin routes with authentication
// Make sure this matches exactly how the admin dashboard is fetching data
app.use('/admin', requireAuth, adminRoutes);

// Make sure all API endpoints are reachable from the client
// This is crucial for Heroku where routing might work differently
console.log('Setting up routes:');
console.log('- GET /admin/polls for poll data');
console.log('- POST /api/polls/:pollId/status for toggling poll activation');

// Placeholder image API
app.get('/api/placeholder/:width/:height', (req, res) => {
    const width = req.params.width;
    const height = req.params.height;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <rect width="100%" height="100%" fill="#333333" />
            <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">
                ${width}×${height}
            </text>
        </svg>
    `);
});

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Debug middleware - log all incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: 'The presentation server encountered an error.'
    });
});

// Import seed function
const { seedAll } = require('./db/seed');

// Start the server
app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Presentation available at: http://localhost:${port}/`);
    console.log(`Admin dashboard: http://localhost:${port}/admin`);
    
    // Seed the database with initial poll data and test contacts
    try {
        await seedAll();
        console.log('Database seeded successfully with polls, contacts, and responses');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
});