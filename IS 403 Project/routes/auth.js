const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/database');
const { requireGuest, requireAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for profile photo uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/profiles');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
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

// Landing page
router.get('/', (req, res) => {
    res.render('landing', {
        pageTitle: 'Cal-Endure to the End - PMG Calendar for Returned Missionaries'
    });
});

// Login page
router.get('/login', requireGuest, (req, res) => {
    res.render('login', {
        pageTitle: 'Login - Cal-Endure to the End'
    });
});

// Signup page
router.get('/signup', requireGuest, (req, res) => {
    res.render('signup', {
        pageTitle: 'Create Account - Cal-Endure to the End'
    });
});

// Handle login
router.post('/login', requireGuest, async (req, res) => {
    const { email, password, remember } = req.body;

    try {
        // Find user by email (normalize to lowercase)
        const user = await db('users')
            .where({ email: email.trim().toLowerCase() })
            .first();

        if (!user) {
            req.session.error = 'Invalid email or password';
            return res.redirect('/login');
        }

        // Compare password
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            req.session.error = 'Invalid email or password';
            return res.redirect('/login');
        }

        // Set session
        req.session.user = {
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            username: user.username,
            mission: user.mission,
            profile_photo: user.profile_photo
        };

        // Extend session if "remember me" is checked
        if (remember === 'on') {
            req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30; // 30 days
        }

        req.session.success = 'Welcome back!';
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Login error:', error);
        req.session.error = 'An error occurred during login';
        res.redirect('/login');
    }
});

// Handle signup
router.post('/signup', requireGuest, async (req, res) => {
    const { firstName, lastName, email, username, password, confirmPassword, mission } = req.body;

    try {
        // Validation
        if (!firstName || !lastName || !email || !username || !password) {
            req.session.error = 'All required fields must be filled';
            return res.redirect('/signup');
        }

        // Email format validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            req.session.error = 'Invalid email format';
            return res.redirect('/signup');
        }

        // Username validation (alphanumeric, underscores, 3-30 chars)
        if (!/^[a-zA-Z0-9_]{3,30}$/.test(username.trim())) {
            req.session.error = 'Username must be 3-30 characters and contain only letters, numbers, and underscores';
            return res.redirect('/signup');
        }

        if (password !== confirmPassword) {
            req.session.error = 'Passwords do not match';
            return res.redirect('/signup');
        }

        if (password.length < 6) {
            req.session.error = 'Password must be at least 6 characters';
            return res.redirect('/signup');
        }

        // Check if email or username already exists
        const existingUser = await db('users')
            .where({ email })
            .orWhere({ username })
            .first();

        if (existingUser) {
            req.session.error = 'Email or username already exists';
            return res.redirect('/signup');
        }

        // Hash password
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Insert new user
        const [newUser] = await db('users')
            .insert({
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                email: email.trim().toLowerCase(),
                username: username.trim().toLowerCase(),
                password_hash,
                mission: mission ? mission.trim() : null
            })
            .returning(['user_id', 'first_name', 'last_name', 'email', 'username', 'mission', 'profile_photo']);

        // Set session
        req.session.user = {
            user_id: newUser.user_id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            username: newUser.username,
            mission: newUser.mission,
            profile_photo: newUser.profile_photo
        };

        req.session.success = 'Account created successfully! Welcome!';
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Signup error:', error);
        req.session.error = 'An error occurred during signup';
        res.redirect('/signup');
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
});

// Update user profile photo
router.post('/profile/photo', requireAuth, upload.single('profilePhoto'), async (req, res) => {
    const userId = req.session.user.user_id;

    try {
        if (!req.file) {
            req.session.error = 'No photo uploaded';
            return res.redirect('/dashboard');
        }

        // Get current user to find old photo
        const currentUser = await db('users')
            .select('profile_photo')
            .where({ user_id: userId })
            .first();

        const newPhoto = `/uploads/profiles/${req.file.filename}`;

        // Update user profile photo
        await db('users')
            .where({ user_id: userId })
            .update({ profile_photo: newPhoto });

        // Delete old photo if it exists and is not a placeholder
        if (currentUser && currentUser.profile_photo &&
            !currentUser.profile_photo.includes('placeholder') &&
            !currentUser.profile_photo.includes('via.placeholder')) {
            const oldPhotoPath = path.join(__dirname, '..', currentUser.profile_photo);
            if (fs.existsSync(oldPhotoPath)) {
                fs.unlinkSync(oldPhotoPath);
            }
        }

        // Update session
        req.session.user.profile_photo = newPhoto;

        req.session.success = 'Profile photo updated successfully';
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Update profile photo error:', error);
        req.session.error = 'Error updating profile photo';
        res.redirect('/dashboard');
    }
});

// Update user profile
router.post('/profile/update', requireAuth, async (req, res) => {
    const userId = req.session.user.user_id;
    const { firstName, lastName, email, mission } = req.body;

    try {
        // Check if email already exists for another user
        const existingUser = await db('users')
            .where({ email })
            .whereNot({ user_id: userId })
            .first();

        if (existingUser) {
            req.session.error = 'Email already in use by another account';
            return res.redirect('/dashboard');
        }

        // Update user
        await db('users')
            .where({ user_id: userId })
            .update({
                first_name: firstName,
                last_name: lastName,
                email,
                mission: mission || null
            });

        // Update session
        req.session.user.first_name = firstName;
        req.session.user.last_name = lastName;
        req.session.user.email = email;
        req.session.user.mission = mission;

        req.session.success = 'Profile updated successfully';
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Update profile error:', error);
        req.session.error = 'Error updating profile';
        res.redirect('/dashboard');
    }
});

module.exports = router;
