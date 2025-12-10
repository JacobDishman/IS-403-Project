#!/bin/bash

# Cal-Endure to the End - Database Setup Script

echo "Setting up Cal-Endure to the End database..."

# Check if PostgreSQL is running
if ! service postgresql status > /dev/null 2>&1; then
    echo "Starting PostgreSQL..."
    service postgresql start
fi

# Create database
echo "Creating database..."
sudo -u postgres psql -c "DROP DATABASE IF EXISTS cal_endure;"
sudo -u postgres psql -c "CREATE DATABASE cal_endure;"

# Run schema
echo "Creating tables..."
sudo -u postgres psql -d cal_endure -f database/schema.sql

# Insert sample data
echo "Inserting sample data..."
sudo -u postgres psql -d cal_endure -f database/sample-data.sql

echo "Database setup complete!"
echo ""
echo "You can now start the application with: npm start"
echo "Default login credentials:"
echo "  Email: john.smith@email.com"
echo "  Password: password123"
