const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// PostgreSQL connection for session store
const pgPool = require('pg').Pool;
const sessionPool = new pgPool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'cal_endure',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

// Trust proxy for AWS Elastic Beanstalk
if (isProduction) {
    app.set('trust proxy', 1);
}

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session configuration with PostgreSQL store
app.use(session({
    store: new pgSession({
        pool: sessionPool,
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        secure: isProduction, // HTTPS only in production
        httpOnly: true, // Prevent XSS
        sameSite: 'lax' // CSRF protection
    }
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Make user available to all views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.error = req.session.error || null;
    res.locals.success = req.session.success || null;
    // Clear flash messages after setting them
    delete req.session.error;
    delete req.session.success;
    next();
});

// Healthcheck endpoint for AWS ELB
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const contactRoutes = require('./routes/contacts');
const eventRoutes = require('./routes/events');
const goalRoutes = require('./routes/goals');

// Use routes
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/contacts', contactRoutes);
app.use('/calendar', eventRoutes);
app.use('/goals', goalRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', {
        pageTitle: '404 - Page Not Found',
        error: '404',
        message: 'Page not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        pageTitle: 'Error',
        error: '500',
        message: 'Something went wrong!'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
