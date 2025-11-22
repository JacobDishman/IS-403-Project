const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { requireAuth } = require('../middleware/auth');

// All goal routes require authentication
router.use(requireAuth);

// Create new goal
router.post('/create', async (req, res) => {
    const { title, category, targetCount, description, deadline } = req.body;
    const userId = req.session.user.user_id;

    try {
        // Normalize category - capitalize first letter
        const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

        await db('goals').insert({
            user_id: userId,
            title,
            category: normalizedCategory,
            target_count: parseInt(targetCount) || 0,
            description,
            deadline: deadline || null
        });

        req.session.success = 'Goal created successfully';
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Create goal error:', error);
        req.session.error = 'Error creating goal';
        res.redirect('/dashboard');
    }
});

// Update goal
router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { title, category, targetCount, currentCount, description, deadline, isCompleted } = req.body;
    const userId = req.session.user.user_id;

    try {
        // If only updating completion status
        if (isCompleted !== undefined && !title) {
            await db('goals')
                .where({ goal_id: id, user_id: userId })
                .update({ is_completed: isCompleted === 'true' || isCompleted === true });
            return res.status(200).json({ success: true });
        }

        // Full update
        await db('goals')
            .where({ goal_id: id, user_id: userId })
            .update({
                title,
                category,
                target_count: parseInt(targetCount) || 0,
                current_count: parseInt(currentCount) || 0,
                description,
                deadline: deadline || null,
                is_completed: isCompleted === 'true' || isCompleted === true
            });

        req.session.success = 'Goal updated successfully';
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Update goal error:', error);
        req.session.error = 'Error updating goal';
        res.redirect('/dashboard');
    }
});

// Delete goal
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user.user_id;

    try {
        await db('goals')
            .where({ goal_id: id, user_id: userId })
            .del();

        req.session.success = 'Goal deleted successfully';
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Delete goal error:', error);
        req.session.error = 'Error deleting goal';
        res.redirect('/dashboard');
    }
});

// Increment goal progress
router.post('/increment/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user.user_id;

    try {
        await db('goals')
            .where({ goal_id: id, user_id: userId })
            .increment('current_count', 1);

        res.json({ success: true });

    } catch (error) {
        console.error('Increment goal error:', error);
        res.status(500).json({ success: false, error: 'Error updating progress' });
    }
});

module.exports = router;
