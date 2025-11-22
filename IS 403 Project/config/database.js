const knex = require('knex');
require('dotenv').config();

const db = knex({
    client: 'pg',
    connection: {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'cal_endure',
        password: process.env.DB_PASSWORD || 'postgres',
        port: process.env.DB_PORT || 5432,
    },
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
