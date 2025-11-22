-- Sample Data for Testing
-- Password for all users: password123

-- Insert sample user (password: password123)
-- Password hash generated with bcrypt, rounds=10
INSERT INTO users (first_name, last_name, email, username, password_hash, mission, profile_photo)
VALUES
('John', 'Smith', 'john.smith@email.com', 'eldersmith', '$2b$10$.5QazQPi8X4ozv21mKNaz.avMGQ3suMIPhDcpomB15ZLiLwHBzney', 'California San Diego Mission', 'https://via.placeholder.com/150'),
('Sarah', 'Johnson', 'sarah.j@email.com', 'sisterjohnson', '$2b$10$.5QazQPi8X4ozv21mKNaz.avMGQ3suMIPhDcpomB15ZLiLwHBzney', 'Utah Provo Mission', 'https://via.placeholder.com/150');

-- Insert sample contacts for user 1
INSERT INTO contacts (user_id, first_name, last_name, phone, email, street_address, city, state, zip_code, photo, notes, is_favorite)
VALUES
(1, 'Michael', 'Anderson', '801-555-0101', 'michael.a@email.com', '123 Main St', 'Provo', 'UT', '84601', 'https://via.placeholder.com/150', 'Met at church', TRUE),
(1, 'Emily', 'Davis', '801-555-0102', 'emily.d@email.com', '456 Oak Ave', 'Orem', 'UT', '84057', 'https://via.placeholder.com/150', 'Young Women leader', TRUE),
(1, 'David', 'Wilson', '801-555-0103', 'david.w@email.com', '789 Pine Rd', 'Provo', 'UT', '84601', 'https://via.placeholder.com/150', 'Served in same mission', FALSE),
(1, 'Jennifer', 'Martinez', '801-555-0104', 'jennifer.m@email.com', '321 Elm St', 'Springville', 'UT', '84663', 'https://via.placeholder.com/150', 'Study group member', TRUE),
(1, 'Robert', 'Taylor', '801-555-0105', 'robert.t@email.com', '654 Maple Dr', 'Pleasant Grove', 'UT', '84062', 'https://via.placeholder.com/150', 'Home teacher', FALSE),
(1, 'Amanda', 'Brown', '801-555-0106', 'amanda.b@email.com', '987 Cedar Ln', 'Lehi', 'UT', '84043', 'https://via.placeholder.com/150', 'Institute friend', FALSE);

-- Insert sample goals for user 1
INSERT INTO goals (user_id, title, category, target_count, current_count, description, deadline, is_completed)
VALUES
(1, 'Scripture Study Daily', 'Spiritual', 30, 18, 'Read scriptures for 30 minutes every day', '2025-03-31', FALSE),
(1, 'Temple Attendance', 'Spiritual', 4, 2, 'Attend temple once per week this month', '2025-02-28', FALSE),
(1, 'Family History Work', 'Spiritual', 10, 5, 'Find and index 10 family names', '2025-03-31', FALSE),
(1, 'Visit Friends Weekly', 'Social', 4, 2, 'Meet with friends at least once per week', '2025-02-28', FALSE),
(1, 'Institute Attendance', 'Social', 8, 4, 'Attend institute class twice per week', '2025-03-31', FALSE),
(1, 'Read 2 Books', 'Intellectual', 2, 0, 'Read two non-fiction books this semester', '2025-04-30', FALSE),
(1, 'Complete Online Course', 'Intellectual', 1, 0, 'Finish web development course', '2025-03-31', FALSE),
(1, 'Exercise 5x Per Week', 'Physical', 20, 12, 'Work out at least 5 times per week', '2025-03-31', FALSE),
(1, 'Sleep 8 Hours', 'Physical', 30, 20, 'Get 8 hours of sleep every night', '2025-02-28', FALSE),
(1, 'Weekly Date Night', 'Romantic', 4, 1, 'Plan a date night once per week', '2025-02-28', FALSE),
(1, 'Learn Love Language', 'Romantic', 1, 0, 'Read and apply The 5 Love Languages', '2025-03-31', FALSE),
(1, 'Plan Future Together', 'Romantic', 1, 0, 'Have serious conversation about future plans', '2025-03-15', FALSE);

-- Insert sample events for user 1 (current month)
INSERT INTO events (user_id, title, event_date, start_time, end_time, event_type, location, notes, reminder)
VALUES
-- Today's events
(1, 'Morning Scripture Study', CURRENT_DATE, '06:00:00', '06:30:00', 'Spiritual', 'Home', 'Study Book of Mormon', TRUE),
(1, 'Gym Workout', CURRENT_DATE, '07:00:00', '08:00:00', 'Physical', 'BYU Gym', 'Leg day', TRUE),
(1, 'Lunch with Sarah', CURRENT_DATE, '12:00:00', '13:00:00', 'Social', 'Cafe Rio', 'Catch up', TRUE),

-- This week
(1, 'Institute Class', CURRENT_DATE + 1, '18:00:00', '19:00:00', 'Intellectual', 'Institute Building', 'New Testament study', TRUE),
(1, 'Basketball Night', CURRENT_DATE + 2, '20:00:00', '22:00:00', 'Social', 'Church Gym', 'Ward activity', FALSE),
(1, 'Temple Session', CURRENT_DATE + 3, '10:00:00', '12:00:00', 'Spiritual', 'Provo Temple', 'Endowment session', TRUE),
(1, 'Study Group', CURRENT_DATE + 4, '15:00:00', '17:00:00', 'Intellectual', 'Library', 'Group project', FALSE),
(1, 'Date Night', CURRENT_DATE + 5, '19:00:00', '22:00:00', 'Romantic', 'Downtown Provo', 'Dinner and movie', TRUE),

-- Next week
(1, 'Sacrament Meeting', CURRENT_DATE + 7, '09:00:00', '10:15:00', 'Spiritual', 'Ward Chapel', 'Sunday worship', TRUE),
(1, 'Sunday School', CURRENT_DATE + 7, '10:30:00', '11:30:00', 'Spiritual', 'Ward Chapel', 'Gospel Doctrine', FALSE),
(1, 'Family Dinner', CURRENT_DATE + 8, '18:00:00', '20:00:00', 'Social', 'Parents House', 'Weekly family dinner', TRUE),
(1, 'Morning Run', CURRENT_DATE + 9, '06:30:00', '07:30:00', 'Physical', 'Provo Canyon Trail', '5 mile run', FALSE),
(1, 'Online Class', CURRENT_DATE + 10, '14:00:00', '16:00:00', 'Intellectual', 'Home', 'Web Development Course', TRUE);

-- Associate some contacts with events
INSERT INTO contact_events (contact_id, event_id)
VALUES
(2, 3),  -- Emily with Lunch with Sarah
(1, 5),  -- Michael with Basketball Night
(4, 7),  -- Jennifer with Study Group
(2, 8);  -- Emily with Date Night
