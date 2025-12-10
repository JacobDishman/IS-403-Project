const knex = require('knex');
require('dotenv').config();

// Check if we're using RDS (AWS) based on environment or connection string
const isRDS = process.env.DB_HOST && (
    process.env.DB_HOST.includes('rds.amazonaws.com') ||
    process.env.RDS_HOSTNAME ||
    process.env.NODE_ENV === 'production'
);

// Build connection configuration
const connectionConfig = {
    user: process.env.DB_USER || process.env.RDS_USERNAME || 'postgres',
    host: process.env.DB_HOST || process.env.RDS_HOSTNAME || 'localhost',
    database: process.env.DB_NAME || process.env.RDS_DB_NAME || 'cal_endure',
    password: process.env.DB_PASSWORD || process.env.RDS_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || process.env.RDS_PORT || '5432'),
};

// Add SSL configuration for RDS
if (isRDS) {
    connectionConfig.ssl = {
        rejectUnauthorized: false // Required for AWS RDS
    };
}

const db = knex({
    client: 'pg',
    connection: connectionConfig,
    pool: {
        min: 2,
        max: 10
    }
});

// Test connection
db.raw('SELECT 1')
    .then(() => {
        console.log('Connected to PostgreSQL database via Knex');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
        process.exit(-1);
    });

module.exports = db;
