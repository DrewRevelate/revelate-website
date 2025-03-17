// middleware/auth.js
// Authentication middleware for the admin portal

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Session management
const sessions = {};
const SESSION_TIMEOUT = 3600000; // 1 hour in milliseconds

// Read password from password.md file
function getPasswordFromFile() {
  try {
    const passwordFile = path.join(process.cwd(), 'password.md');
    const fileContent = fs.readFileSync(passwordFile, 'utf8');
    
    // Extract password - looking for line after "# Admin Portal Password"
    const passwordMatch = fileContent.match(/# Admin Portal Password\r?\n(.*)/);
    if (passwordMatch && passwordMatch[1]) {
      return passwordMatch[1].trim();
    }
    
    // If no formatted password found, use the whole file (single line)
    return fileContent.trim();
  } catch (error) {
    console.error('Error reading password file:', error);
    // Return a default fallback password if file can't be read
    return 'fullthrottle123';
  }
}

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(sessions).forEach(sessionId => {
    if (sessions[sessionId].expires < now) {
      delete sessions[sessionId];
    }
  });
}, 60000); // Run every minute

// Middleware to check if user is authenticated
function requireAuth(req, res, next) {
  // Skip auth check for these routes
  if (req.path === '/admin/login' || req.path === '/admin/auth') {
    console.log('Skipping auth check for login route:', req.path);
    return next();
  }
  
  console.log('Authentication check for path:', req.path);
  
  // Check for session cookie
  const sessionId = req.cookies && req.cookies.adminSession;
  console.log('Session ID from cookies:', sessionId ? 'Present' : 'Missing');
  
  if (sessionId && sessions[sessionId] && sessions[sessionId].expires > Date.now()) {
    // Session exists and is valid - extend expiration
    console.log('Valid session found, extending expiration');
    sessions[sessionId].expires = Date.now() + SESSION_TIMEOUT;
    return next();
  }
  
  // DEVELOPMENT BYPASS (REMOVE IN PRODUCTION)
  // This allows access to admin pages without authentication during development
  // Remove this block for production deployment
  if (process.env.NODE_ENV !== 'production') {
    console.log('DEV MODE: Bypassing authentication');
    return next();
  }
  
  // If AJAX request, return 401
  if (req.xhr || req.headers.accept && req.headers.accept.includes('application/json')) {
    console.log('AJAX request without authentication, returning 401');
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }
  
  // Redirect to login page
  console.log('No valid session found, redirecting to login page');
  res.redirect('/admin/login');
}

// Login handler
function handleLogin(req, res) {
  const filePassword = getPasswordFromFile();
  const providedPassword = req.body.password;
  
  // Debug logging - be careful with this in production
  console.log('Password from file:', filePassword);
  console.log('Password provided:', providedPassword);
  
  // Accept either the file password or the hardcoded default
  if (providedPassword === filePassword || providedPassword === 'fullthrottle123') {
    // Generate secure session ID
    const sessionId = crypto.randomBytes(32).toString('hex');
    
    // Create session
    sessions[sessionId] = {
      expires: Date.now() + SESSION_TIMEOUT,
      username: 'admin'
    };
    
    // Set cookie
    res.cookie('adminSession', sessionId, {
      httpOnly: true,
      maxAge: SESSION_TIMEOUT,
      sameSite: 'strict'
    });
    
    console.log('Login successful for admin user');
    res.json({ success: true, redirect: '/admin' });
  } else {
    console.log('Login failed - password mismatch');
    res.status(401).json({ success: false, error: 'Invalid password' });
  }
}

// Logout handler
function handleLogout(req, res) {
  const sessionId = req.cookies && req.cookies.adminSession;
  
  if (sessionId && sessions[sessionId]) {
    delete sessions[sessionId];
  }
  
  res.clearCookie('adminSession');
  res.redirect('/admin/login');
}

module.exports = {
  requireAuth,
  handleLogin,
  handleLogout
};