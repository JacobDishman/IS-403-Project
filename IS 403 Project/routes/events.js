const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { requireAuth } = require('../middleware/auth');

// All event routes require authentication
router.use(requireAuth);

// Valid event types
const VALID_EVENT_TYPES = ['Spiritual', 'Social', 'Intellectual', 'Physical', 'Romantic'];

// Helper to capitalize event type
function capitalizeEventType(type) {
    if (!type) return null;
    const lower = type.toLowerCase();
    return VALID_EVENT_TYPES.find(t => t.toLowerCase() === lower) || null;
}

// Helper to validate time format (HH:MM or HH:MM:SS)
function isValidTime(time) {
    if (!time) return false;
    return /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(time);
}

// Helper to validate date format (YYYY-MM-DD)
function isValidDate(date) {
    if (!date) return false;
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date));
}

// Calendar main page - supports month, week, and day views
router.get('/', async (req, res) => {
    try {
        const userId = req.session.user.user_id;
        const { year, month, week, day, view } = req.query;

        // Get current date
        const today = new Date();
        const currentYear = year ? parseInt(year) : today.getFullYear();
        const currentMonth = month ? parseInt(month) : today.getMonth() + 1;
        const currentDay = day ? parseInt(day) : today.getDate();
        const currentView = view || 'month';

        let events;
        let dateRange = {};

        if (currentView === 'week') {
            // Calculate week start (Sunday) and end (Saturday)
            const selectedDate = new Date(currentYear, currentMonth - 1, currentDay);
            const dayOfWeek = selectedDate.getDay();
            const weekStart = new Date(selectedDate);
            weekStart.setDate(selectedDate.getDate() - dayOfWeek);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

            dateRange = {
                start: weekStart.toISOString().split('T')[0],
                end: weekEnd.toISOString().split('T')[0]
            };

            events = await db.raw(`
                SELECT e.*,
                       ARRAY_AGG(
                           CASE
                               WHEN c.contact_id IS NOT NULL
                               THEN json_build_object(
                                   'contact_id', c.contact_id,
                                   'first_name', c.first_name,
                                   'last_name', c.last_name
                               )
                           END
                       ) FILTER (WHERE c.contact_id IS NOT NULL) as contacts
                FROM events e
                LEFT JOIN contact_events ce ON e.event_id = ce.event_id
                LEFT JOIN contacts c ON ce.contact_id = c.contact_id
                WHERE e.user_id = ?
                  AND e.event_date >= ?
                  AND e.event_date <= ?
                GROUP BY e.event_id
                ORDER BY e.event_date, e.start_time
            `, [userId, dateRange.start, dateRange.end]);

        } else if (currentView === 'day') {
            const selectedDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;
            dateRange = { start: selectedDate, end: selectedDate };

            events = await db.raw(`
                SELECT e.*,
                       ARRAY_AGG(
                           CASE
                               WHEN c.contact_id IS NOT NULL
                               THEN json_build_object(
                                   'contact_id', c.contact_id,
                                   'first_name', c.first_name,
                                   'last_name', c.last_name
                               )
                           END
                       ) FILTER (WHERE c.contact_id IS NOT NULL) as contacts
                FROM events e
                LEFT JOIN contact_events ce ON e.event_id = ce.event_id
                LEFT JOIN contacts c ON ce.contact_id = c.contact_id
                WHERE e.user_id = ? AND e.event_date = ?
                GROUP BY e.event_id
                ORDER BY e.start_time
            `, [userId, selectedDate]);

        } else {
            // Month view (default)
            events = await db.raw(`
                SELECT e.*,
                       ARRAY_AGG(
                           CASE
                               WHEN c.contact_id IS NOT NULL
                               THEN json_build_object(
                                   'contact_id', c.contact_id,
                                   'first_name', c.first_name,
                                   'last_name', c.last_name
                               )
                           END
                       ) FILTER (WHERE c.contact_id IS NOT NULL) as contacts
                FROM events e
                LEFT JOIN contact_events ce ON e.event_id = ce.event_id
                LEFT JOIN contacts c ON ce.contact_id = c.contact_id
                WHERE e.user_id = ?
                  AND EXTRACT(YEAR FROM e.event_date) = ?
                  AND EXTRACT(MONTH FROM e.event_date) = ?
                GROUP BY e.event_id
                ORDER BY e.event_date, e.start_time
            `, [userId, currentYear, currentMonth]);
        }

        // Get today's events
        const todayEvents = await db.raw(`
            SELECT e.*,
                   ARRAY_AGG(
                       CASE
                           WHEN c.contact_id IS NOT NULL
                           THEN json_build_object(
                               'contact_id', c.contact_id,
                               'first_name', c.first_name,
                               'last_name', c.last_name
                           )
                       END
                   ) FILTER (WHERE c.contact_id IS NOT NULL) as contacts
            FROM events e
            LEFT JOIN contact_events ce ON e.event_id = ce.event_id
            LEFT JOIN contacts c ON ce.contact_id = c.contact_id
            WHERE e.user_id = ? AND e.event_date = CURRENT_DATE
            GROUP BY e.event_id
            ORDER BY e.start_time
        `, [userId]);

        // Get all contacts for the contact selector
        const contacts = await db('contacts')
            .select('contact_id', 'first_name', 'last_name')
            .where({ user_id: userId })
            .orderBy('last_name')
            .orderBy('first_name');

        // Get goals for goal selector
        const goals = await db('goals')
            .select('goal_id', 'title', 'category', 'current_count', 'target_count')
            .where({ user_id: userId, is_completed: false })
            .orderBy('category')
            .orderBy('title');

        res.render('calendar', {
            pageTitle: 'Calendar - Cal-Endure to the End',
            currentPage: 'calendar',
            events: events.rows,
            todayEvents: todayEvents.rows,
            contacts,
            goals,
            currentYear,
            currentMonth,
            currentDay,
            currentView,
            dateRange,
            today: {
                year: today.getFullYear(),
                month: today.getMonth() + 1,
                day: today.getDate()
            }
        });

    } catch (error) {
        console.error('Calendar error:', error);
        req.session.error = 'Error loading calendar';
        res.redirect('/dashboard');
    }
});

// Create new event
router.post('/create', async (req, res) => {
    const {
        title, eventDate, startTime, endTime, eventType,
        location, notes, contacts, goalId
    } = req.body;
    const userId = req.session.user.user_id;

    try {
        // Validation
        if (!title || !title.trim()) {
            throw new Error('Title is required');
        }
        if (!isValidDate(eventDate)) {
            throw new Error('Invalid date format');
        }
        if (!isValidTime(startTime)) {
            throw new Error('Invalid start time format');
        }
        if (endTime && !isValidTime(endTime)) {
            throw new Error('Invalid end time format');
        }
        if (endTime && startTime > endTime) {
            throw new Error('End time must be after start time');
        }

        const normalizedEventType = capitalizeEventType(eventType);
        if (eventType && !normalizedEventType) {
            throw new Error('Invalid event type. Must be: Spiritual, Social, Intellectual, Physical, or Romantic');
        }

        // Insert event
        const [event] = await db('events')
            .insert({
                user_id: userId,
                goal_id: goalId || null,
                title: title.trim(),
                event_date: eventDate,
                start_time: startTime,
                end_time: endTime || null,
                event_type: normalizedEventType,
                location: location ? location.trim() : null,
                notes: notes ? notes.trim() : null
            })
            .returning('*');

        const eventId = event.event_id;

        // Associate contacts with event
        if (contacts) {
            const contactIds = Array.isArray(contacts) ? contacts : [contacts];
            for (const contactId of contactIds) {
                if (contactId) {
                    await db('contact_events').insert({
                        contact_id: contactId,
                        event_id: eventId
                    });
                }
            }
        }

        // Auto-increment goal progress if event has a matching category
        if (normalizedEventType) {
            // Find active goals with matching category and increment them
            const matchingGoals = await db('goals')
                .where({
                    user_id: userId,
                    category: normalizedEventType,
                    is_completed: false
                })
                .whereRaw('current_count < target_count');

            for (const goal of matchingGoals) {
                const newCount = goal.current_count + 1;
                const isCompleted = newCount >= goal.target_count;

                await db('goals')
                    .where({ goal_id: goal.goal_id })
                    .update({
                        current_count: newCount,
                        is_completed: isCompleted
                    });
            }
        }

        req.session.success = 'Event created successfully';
        res.redirect('/calendar');

    } catch (error) {
        console.error('Create event error:', error);
        req.session.error = 'Error creating event: ' + error.message;
        res.redirect('/calendar');
    }
});

// Get single event (for editing)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user.user_id;

    try {
        const result = await db.raw(`
            SELECT e.*,
                   ARRAY_AGG(ce.contact_id) FILTER (WHERE ce.contact_id IS NOT NULL) as contact_ids
            FROM events e
            LEFT JOIN contact_events ce ON e.event_id = ce.event_id
            WHERE e.event_id = ? AND e.user_id = ?
            GROUP BY e.event_id
        `, [id, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json({ event: result.rows[0] });

    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({ error: 'Error loading event' });
    }
});

// Update event
router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const {
        title, eventDate, startTime, endTime, eventType,
        location, notes, contacts, goalId
    } = req.body;
    const userId = req.session.user.user_id;

    try {
        // Validation
        if (!title || !title.trim()) {
            throw new Error('Title is required');
        }
        if (!isValidDate(eventDate)) {
            throw new Error('Invalid date format');
        }
        if (!isValidTime(startTime)) {
            throw new Error('Invalid start time format');
        }
        if (endTime && !isValidTime(endTime)) {
            throw new Error('Invalid end time format');
        }
        if (endTime && startTime > endTime) {
            throw new Error('End time must be after start time');
        }

        const normalizedEventType = capitalizeEventType(eventType);
        if (eventType && !normalizedEventType) {
            throw new Error('Invalid event type');
        }

        // Update event
        await db('events')
            .where({ event_id: id, user_id: userId })
            .update({
                goal_id: goalId || null,
                title: title.trim(),
                event_date: eventDate,
                start_time: startTime,
                end_time: endTime || null,
                event_type: normalizedEventType,
                location: location ? location.trim() : null,
                notes: notes ? notes.trim() : null
            });

        // Delete existing contact associations
        await db('contact_events').where({ event_id: id }).del();

        // Add new contact associations
        if (contacts) {
            const contactIds = Array.isArray(contacts) ? contacts : [contacts];
            for (const contactId of contactIds) {
                if (contactId) {
                    await db('contact_events').insert({
                        contact_id: contactId,
                        event_id: id
                    });
                }
            }
        }

        req.session.success = 'Event updated successfully';
        res.redirect('/calendar');

    } catch (error) {
        console.error('Update event error:', error);
        req.session.error = 'Error updating event: ' + error.message;
        res.redirect('/calendar');
    }
});

// Delete event
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user.user_id;

    try {
        await db('events')
            .where({ event_id: id, user_id: userId })
            .del();

        req.session.success = 'Event deleted successfully';
        res.redirect('/calendar');

    } catch (error) {
        console.error('Delete event error:', error);
        req.session.error = 'Error deleting event';
        res.redirect('/calendar');
    }
});

// Update event date (for drag-and-drop)
router.post('/move/:id', async (req, res) => {
    const { id } = req.params;
    const { newDate } = req.body;
    const userId = req.session.user.user_id;

    try {
        if (!isValidDate(newDate)) {
            return res.status(400).json({ success: false, error: 'Invalid date format' });
        }

        const result = await db('events')
            .where({ event_id: id, user_id: userId })
            .update({ event_date: newDate })
            .returning('*');

        if (result.length === 0) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }

        res.json({ success: true, event: result[0] });

    } catch (error) {
        console.error('Move event error:', error);
        res.status(500).json({ success: false, error: 'Error moving event' });
    }
});

// Mark event as completed
router.post('/complete/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user.user_id;

    try {
        const result = await db('events')
            .where({ event_id: id, user_id: userId })
            .update({ is_completed: true })
            .returning('*');

        if (result.length === 0) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }

        res.json({ success: true, event: result[0] });

    } catch (error) {
        console.error('Complete event error:', error);
        res.status(500).json({ success: false, error: 'Error completing event' });
    }
});

// Get events for a specific date range (API endpoint)
router.get('/api/range', async (req, res) => {
    const { start, end } = req.query;
    const userId = req.session.user.user_id;

    try {
        if (!isValidDate(start) || !isValidDate(end)) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        const events = await db.raw(`
            SELECT e.*,
                   ARRAY_AGG(
                       CASE
                           WHEN c.contact_id IS NOT NULL
                           THEN json_build_object(
                               'contact_id', c.contact_id,
                               'first_name', c.first_name,
                               'last_name', c.last_name
                           )
                       END
                   ) FILTER (WHERE c.contact_id IS NOT NULL) as contacts
            FROM events e
            LEFT JOIN contact_events ce ON e.event_id = ce.event_id
            LEFT JOIN contacts c ON ce.contact_id = c.contact_id
            WHERE e.user_id = ?
              AND e.event_date >= ?
              AND e.event_date <= ?
            GROUP BY e.event_id
            ORDER BY e.event_date, e.start_time
        `, [userId, start, end]);

        res.json({ events: events.rows });

    } catch (error) {
        console.error('Get events range error:', error);
        res.status(500).json({ error: 'Error loading events' });
    }
});

module.exports = router;
