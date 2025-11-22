const knex = require('knex');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const connectionConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'cal_endure',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
};

// Add SSL configuration for AWS RDS in production
if (isProduction) {
    connectionConfig.ssl = {
        rejectUnauthorized: false
    };
}

const db = knex({
    client: 'pg',
    connection: connectionConfig,
    pool: {
        min: 2,
        max: 10,
        acquireTimeoutMillis: 30000,
        createTimeoutMillis: 30000,
        destroyTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 100,
    },
    acquireConnectionTimeout: 60000
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
