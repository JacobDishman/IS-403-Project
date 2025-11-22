const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { requireAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/contacts');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'contact-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// All contact routes require authentication
router.use(requireAuth);

// Contacts list page
router.get('/', async (req, res) => {
    try {
        const userId = req.session.user.user_id;
        const { search, filter } = req.query;

        // Build query using Knex
        let query = db('contacts as c')
            .select('c.*')
            .count('ce.event_id as event_count')
            .leftJoin('contact_events as ce', 'c.contact_id', 'ce.contact_id')
            .where('c.user_id', userId)
            .groupBy('c.contact_id');

        // Add search filter
        if (search) {
            query = query.where(function() {
                this.whereRaw("LOWER(c.first_name || ' ' || c.last_name) LIKE LOWER(?)", [`%${search}%`])
                    .orWhereRaw('LOWER(c.email) LIKE LOWER(?)', [`%${search}%`])
                    .orWhereRaw('LOWER(c.phone) LIKE LOWER(?)', [`%${search}%`]);
            });
        }

        // Apply sorting based on filter
        if (filter === 'recent') {
            query = query.orderBy('c.created_at', 'desc').limit(10);
        } else {
            query = query.orderBy('c.last_name').orderBy('c.first_name');
        }

        let contacts = await query;

        // Apply favorite filter (post-query since we need all for alphabetical sort)
        if (filter === 'favorites') {
            contacts = contacts.filter(c => c.is_favorite);
        }

        res.render('contacts', {
            pageTitle: 'Contacts - Cal-Endure to the End',
            currentPage: 'contacts',
            contacts,
            search: search || '',
            filter: filter || 'all'
        });

    } catch (error) {
        console.error('Contacts list error:', error);
        req.session.error = 'Error loading contacts';
        res.redirect('/dashboard');
    }
});

// Create new contact
router.post('/create', upload.single('photo'), async (req, res) => {
    const {
        firstName, lastName, phone, email,
        streetAddress, city, state, zipCode, notes
    } = req.body;
    const userId = req.session.user.user_id;

    try {
        // Validation
        if (!firstName || !firstName.trim()) {
            req.session.error = 'First name is required';
            return res.redirect('/contacts');
        }
        if (!lastName || !lastName.trim()) {
            req.session.error = 'Last name is required';
            return res.redirect('/contacts');
        }

        // Basic email validation if provided
        if (email && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            req.session.error = 'Invalid email format';
            return res.redirect('/contacts');
        }

        const photo = req.file ? `/uploads/contacts/${req.file.filename}` : 'https://via.placeholder.com/150';

        await db('contacts').insert({
            user_id: userId,
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone ? phone.trim() : null,
            email: email ? email.trim() : null,
            street_address: streetAddress ? streetAddress.trim() : null,
            city: city ? city.trim() : null,
            state: state ? state.trim() : null,
            zip_code: zipCode ? zipCode.trim() : null,
            photo,
            notes: notes ? notes.trim() : null
        });

        req.session.success = 'Contact created successfully';
        res.redirect('/contacts');

    } catch (error) {
        console.error('Create contact error:', error);
        req.session.error = 'Error creating contact';
        res.redirect('/contacts');
    }
});

// Get single contact (for editing)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user.user_id;

    try {
        const contact = await db('contacts')
            .where({ contact_id: id, user_id: userId })
            .first();

        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        const events = await db('events as e')
            .join('contact_events as ce', 'e.event_id', 'ce.event_id')
            .where({ 'ce.contact_id': id, 'e.user_id': userId })
            .orderBy('e.event_date', 'desc')
            .orderBy('e.start_time', 'desc');

        res.json({
            contact,
            events
        });

    } catch (error) {
        console.error('Get contact error:', error);
        res.status(500).json({ error: 'Error loading contact' });
    }
});

// Update contact
router.post('/update/:id', upload.single('photo'), async (req, res) => {
    const { id } = req.params;
    const {
        firstName, lastName, phone, email,
        streetAddress, city, state, zipCode, notes
    } = req.body;
    const userId = req.session.user.user_id;

    try {
        // Validation
        if (!firstName || !firstName.trim()) {
            req.session.error = 'First name is required';
            return res.redirect('/contacts');
        }
        if (!lastName || !lastName.trim()) {
            req.session.error = 'Last name is required';
            return res.redirect('/contacts');
        }

        // Basic email validation if provided
        if (email && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            req.session.error = 'Invalid email format';
            return res.redirect('/contacts');
        }

        // Get current contact to check if photo exists
        const currentContact = await db('contacts')
            .select('photo')
            .where({ contact_id: id, user_id: userId })
            .first();

        if (!currentContact) {
            req.session.error = 'Contact not found';
            return res.redirect('/contacts');
        }

        let photo = currentContact.photo;

        // If new photo uploaded, use it
        if (req.file) {
            photo = `/uploads/contacts/${req.file.filename}`;

            // Delete old photo if it's not a placeholder
            const oldPhoto = currentContact.photo;
            if (oldPhoto && !oldPhoto.includes('placeholder') && !oldPhoto.includes('via.placeholder')) {
                const oldPhotoPath = path.join(__dirname, '..', oldPhoto);
                if (fs.existsSync(oldPhotoPath)) {
                    fs.unlinkSync(oldPhotoPath);
                }
            }
        }

        await db('contacts')
            .where({ contact_id: id, user_id: userId })
            .update({
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                phone: phone ? phone.trim() : null,
                email: email ? email.trim() : null,
                street_address: streetAddress ? streetAddress.trim() : null,
                city: city ? city.trim() : null,
                state: state ? state.trim() : null,
                zip_code: zipCode ? zipCode.trim() : null,
                photo,
                notes: notes ? notes.trim() : null
            });

        req.session.success = 'Contact updated successfully';
        res.redirect('/contacts');

    } catch (error) {
        console.error('Update contact error:', error);
        req.session.error = 'Error updating contact';
        res.redirect('/contacts');
    }
});

// Toggle favorite
router.post('/favorite/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user.user_id;

    try {
        const result = await db('contacts')
            .where({ contact_id: id, user_id: userId })
            .update({
                is_favorite: db.raw('NOT is_favorite')
            })
            .returning('is_favorite');

        if (result.length === 0) {
            return res.status(404).json({ success: false, error: 'Contact not found' });
        }

        res.json({ success: true, is_favorite: result[0].is_favorite });

    } catch (error) {
        console.error('Toggle favorite error:', error);
        res.status(500).json({ success: false, error: 'Error updating favorite status' });
    }
});

// Delete contact
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user.user_id;

    try {
        // Get contact to find photo
        const contact = await db('contacts')
            .select('photo')
            .where({ contact_id: id, user_id: userId })
            .first();

        if (!contact) {
            req.session.error = 'Contact not found';
            return res.redirect('/contacts');
        }

        const photo = contact.photo;

        // Delete contact (cascade will delete contact_events)
        await db('contacts')
            .where({ contact_id: id, user_id: userId })
            .del();

        // Delete photo file if it's not a placeholder
        if (photo && !photo.includes('placeholder') && !photo.includes('via.placeholder')) {
            const photoPath = path.join(__dirname, '..', photo);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
        }

        req.session.success = 'Contact deleted successfully';
        res.redirect('/contacts');

    } catch (error) {
        console.error('Delete contact error:', error);
        req.session.error = 'Error deleting contact';
        res.redirect('/contacts');
    }
});

module.exports = router;
