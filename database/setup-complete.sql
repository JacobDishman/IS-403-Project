-- ============================================================================
-- Cal-Endure to the End - Complete Database Setup
-- ============================================================================
-- This script creates all tables, indexes, triggers, and inserts dummy data
-- Password for test user John Smith: password123
-- ============================================================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS contact_events CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- TABLE CREATION
-- ============================================================================

-- Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    mission VARCHAR(100),
    profile_photo VARCHAR(255) DEFAULT 'https://via.placeholder.com/150',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contacts Table
CREATE TABLE contacts (
    contact_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    street_address VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    photo VARCHAR(255) DEFAULT 'https://via.placeholder.com/150',
    notes TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- UPGRADED Events Table - Now linked to goals with status tracking
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    goal_id INT REFERENCES goals(goal_id) ON DELETE SET NULL,
    title VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    event_type VARCHAR(50),
    location VARCHAR(200),
    notes TEXT,
    reminder BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'missed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- UPGRADED Goals Table - Supports Numeric, Recurring, and Calendar goal types
CREATE TABLE goals (
    goal_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    goal_type VARCHAR(20) NOT NULL CHECK (goal_type IN ('numeric', 'recurring', 'calendar')),

    -- Fields for 'numeric' goals
    numeric_current_value INT DEFAULT 0,
    numeric_target_value INT,
    numeric_unit VARCHAR(50), -- e.g., "books", "pages", "times"

    -- Fields for 'recurring' goals
    recurrence_pattern VARCHAR(50), -- e.g., "daily", "weekly", "monthly"
    recurrence_interval INT DEFAULT 1, -- e.g., every 2 weeks
    recurrence_days VARCHAR(50), -- For weekly: "1,3,5" (Mon, Wed, Fri)
    last_completed_at TIMESTAMP,
    completion_count INT DEFAULT 0, -- Total times completed

    -- Fields for 'calendar' goals
    target_date DATE,
    linked_events_required INT DEFAULT 0, -- How many events needed

    -- Common fields
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact_Events Junction Table (Many-to-Many relationship)
CREATE TABLE contact_events (
    contact_event_id SERIAL PRIMARY KEY,
    contact_id INT REFERENCES contacts(contact_id) ON DELETE CASCADE,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    UNIQUE(contact_id, event_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_goal_id ON events(goal_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_category ON goals(category);
CREATE INDEX idx_goals_type ON goals(goal_type);
CREATE INDEX idx_contact_events_contact_id ON contact_events(contact_id);
CREATE INDEX idx_contact_events_event_id ON contact_events(event_id);

-- ============================================================================
-- TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ============================================================================

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
    BEFORE UPDATE ON goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DUMMY DATA - JOHN SMITH TEST USER
-- ============================================================================
-- Login credentials:
--   Email: john.smith@email.com
--   Username: johnsmith
--   Password: password123
-- ============================================================================

-- Insert John Smith user
-- Password hash for "password123" generated with bcrypt (10 rounds)
INSERT INTO users (first_name, last_name, email, username, password_hash, mission, profile_photo)
VALUES
('John', 'Smith', 'john.smith@email.com', 'johnsmith', '$2b$10$.5QazQPi8X4ozv21mKNaz.avMGQ3suMIPhDcpomB15ZLiLwHBzney', 'California San Diego Mission', 'https://via.placeholder.com/150');

-- Get the user_id for John Smith (will be 1 in a fresh database)
-- If running this on an existing database, adjust the user_id values below

-- Insert sample contacts for John Smith (user_id = 1)
INSERT INTO contacts (user_id, first_name, last_name, phone, email, street_address, city, state, zip_code, photo, notes, is_favorite)
VALUES
(1, 'Michael', 'Anderson', '801-555-0101', 'michael.a@email.com', '123 Main St', 'Provo', 'UT', '84601', 'https://via.placeholder.com/150', 'Met at church, very friendly', TRUE),
(1, 'Emily', 'Davis', '801-555-0102', 'emily.d@email.com', '456 Oak Ave', 'Orem', 'UT', '84057', 'https://via.placeholder.com/150', 'Young Women leader, great mentor', TRUE),
(1, 'David', 'Wilson', '801-555-0103', 'david.w@email.com', '789 Pine Rd', 'Provo', 'UT', '84601', 'https://via.placeholder.com/150', 'Served in same mission', FALSE),
(1, 'Jennifer', 'Martinez', '801-555-0104', 'jennifer.m@email.com', '321 Elm St', 'Springville', 'UT', '84663', 'https://via.placeholder.com/150', 'Study group member at BYU', TRUE),
(1, 'Robert', 'Taylor', '801-555-0105', 'robert.t@email.com', '654 Maple Dr', 'Pleasant Grove', 'UT', '84062', 'https://via.placeholder.com/150', 'Home teacher, very dedicated', FALSE),
(1, 'Amanda', 'Brown', '801-555-0106', 'amanda.b@email.com', '987 Cedar Ln', 'Lehi', 'UT', '84043', 'https://via.placeholder.com/150', 'Institute friend', FALSE);

-- Insert sample goals for John Smith (user_id = 1)
-- Categories: Spiritual, Social, Intellectual, Physical, Romantic
-- Goal Types: numeric, recurring, calendar
INSERT INTO goals (user_id, title, category, goal_type, description, numeric_current_value, numeric_target_value, numeric_unit, recurrence_pattern, target_date, is_completed)
VALUES
-- Spiritual Goals (NUMERIC)
(1, 'Daily Scripture Study', 'Spiritual', 'numeric', 'Read scriptures for 30 minutes every morning', 18, 30, 'days', NULL, NULL, FALSE),
(1, 'Temple Attendance', 'Spiritual', 'numeric', 'Attend temple once per week this month', 2, 4, 'visits', NULL, NULL, FALSE),
(1, 'Family History Work', 'Spiritual', 'numeric', 'Find and index 10 family names', 5, 10, 'names', NULL, NULL, FALSE),

-- Social Goals (RECURRING)
(1, 'Visit Friends Weekly', 'Social', 'recurring', 'Meet with friends at least once per week', NULL, NULL, NULL, 'weekly', NULL, FALSE),
(1, 'Institute Attendance', 'Social', 'recurring', 'Attend institute class twice per week', NULL, NULL, NULL, 'weekly', NULL, FALSE),
(1, 'Daily Service', 'Social', 'recurring', 'Perform an act of service each day', NULL, NULL, NULL, 'daily', NULL, FALSE),

-- Intellectual Goals (NUMERIC)
(1, 'Read Non-Fiction Books', 'Intellectual', 'numeric', 'Read two non-fiction books this semester', 0, 2, 'books', NULL, NULL, FALSE),
(1, 'Online Course Progress', 'Intellectual', 'numeric', 'Complete web development course modules', 0, 12, 'modules', NULL, NULL, FALSE),
(1, 'Spanish Practice', 'Intellectual', 'numeric', 'Practice Spanish for 30 hours', 15, 30, 'hours', NULL, NULL, FALSE),

-- Physical Goals (RECURRING & NUMERIC)
(1, 'Exercise 5x Per Week', 'Physical', 'recurring', 'Work out at least 5 times per week', NULL, NULL, NULL, 'weekly', NULL, FALSE),
(1, 'Morning Runs', 'Physical', 'numeric', 'Complete 20 morning runs', 12, 20, 'runs', NULL, NULL, FALSE),
(1, '5K Race Goal', 'Physical', 'calendar', 'Train for and complete a 5K race', NULL, NULL, NULL, NULL, '2025-04-15', FALSE),

-- Romantic Goals (CALENDAR & RECURRING)
(1, 'Weekly Date Night', 'Romantic', 'recurring', 'Plan a creative date night once per week', NULL, NULL, NULL, 'weekly', NULL, FALSE),
(1, 'Love Language Book', 'Romantic', 'calendar', 'Read and apply The 5 Love Languages book', NULL, NULL, NULL, NULL, '2025-03-31', FALSE),
(1, 'Plan Future Together', 'Romantic', 'calendar', 'Have serious conversation about long-term plans', NULL, NULL, NULL, NULL, '2025-03-15', FALSE);

-- Insert sample events for John Smith (user_id = 1)
INSERT INTO events (user_id, goal_id, title, event_date, start_time, end_time, event_type, location, notes, reminder, status)
VALUES
-- Today's events
(1, NULL, 'Morning Scripture Study', CURRENT_DATE, '06:00:00', '06:30:00', 'Spiritual', 'Home', 'Continue reading Book of Mormon', TRUE, 'pending'),
(1, NULL, 'Gym Workout', CURRENT_DATE, '07:00:00', '08:00:00', 'Physical', 'BYU Recreation Center', 'Leg day - squats and lunges', TRUE, 'pending'),
(1, NULL, 'Lunch with Emily', CURRENT_DATE, '12:00:00', '13:00:00', 'Social', 'Cafe Rio', 'Catch up on life', TRUE, 'pending'),
(1, NULL, 'Study Time', CURRENT_DATE, '15:00:00', '17:00:00', 'Intellectual', 'Harold B. Lee Library', 'Work on assignments', FALSE, 'pending'),

-- This week's events
(1, NULL, 'Institute Class', CURRENT_DATE + 1, '18:00:00', '19:00:00', 'Intellectual', 'Institute Building', 'New Testament study - Book of John', TRUE, 'pending'),
(1, NULL, 'Basketball Night', CURRENT_DATE + 2, '20:00:00', '22:00:00', 'Social', 'Church Gym', 'Ward basketball activity', FALSE, 'pending'),
(1, NULL, 'Temple Session', CURRENT_DATE + 3, '10:00:00', '12:00:00', 'Spiritual', 'Provo City Center Temple', 'Endowment session with Michael', TRUE, 'pending'),
(1, NULL, 'Study Group', CURRENT_DATE + 4, '15:00:00', '17:00:00', 'Intellectual', 'BYU Library', 'Group project for IS 403', FALSE, 'pending'),
(1, NULL, 'Date Night', CURRENT_DATE + 5, '19:00:00', '22:00:00', 'Romantic', 'Downtown Provo', 'Dinner at Black Sheep and movie', TRUE, 'pending'),
(1, NULL, 'Morning Run', CURRENT_DATE + 6, '06:30:00', '07:30:00', 'Physical', 'Provo River Trail', '5 mile run', FALSE, 'pending'),

-- Next week's events
(1, NULL, 'Sacrament Meeting', CURRENT_DATE + 7, '09:00:00', '10:15:00', 'Spiritual', 'Ward Chapel', 'Sunday worship service', TRUE, 'pending'),
(1, NULL, 'Sunday School', CURRENT_DATE + 7, '10:30:00', '11:30:00', 'Spiritual', 'Ward Chapel', 'Gospel Doctrine class', FALSE, 'pending'),
(1, NULL, 'Family Dinner', CURRENT_DATE + 8, '18:00:00', '20:00:00', 'Social', 'Parents House', 'Weekly family dinner', TRUE, 'pending'),
(1, NULL, 'Online Class', CURRENT_DATE + 9, '14:00:00', '16:00:00', 'Intellectual', 'Home', 'Web Development Course - JavaScript module', TRUE, 'pending'),
(1, NULL, 'Service Project', CURRENT_DATE + 10, '09:00:00', '12:00:00', 'Social', 'Local Food Bank', 'Volunteer shift', TRUE, 'pending');

-- Associate some contacts with events (linking contacts to specific events)
INSERT INTO contact_events (contact_id, event_id)
VALUES
(2, 3),   -- Emily with Lunch
(1, 7),   -- Michael with Temple Session
(4, 8),   -- Jennifer with Study Group
(2, 9);   -- Emily with Date Night

-- ============================================================================
-- VERIFICATION QUERIES (Optional - run these to verify setup)
-- ============================================================================
-- SELECT * FROM users WHERE username = 'johnsmith';
-- SELECT COUNT(*) FROM contacts WHERE user_id = 1;
-- SELECT COUNT(*) FROM goals WHERE user_id = 1;
-- SELECT COUNT(*) FROM events WHERE user_id = 1;
-- SELECT * FROM contact_events;
