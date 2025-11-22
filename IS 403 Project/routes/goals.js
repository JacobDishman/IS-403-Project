const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { requireAuth } = require('../middleware/auth');

// All goal routes require authentication
router.use(requireAuth);

// Valid goal categories (must match event types)
const VALID_CATEGORIES = ['Spiritual', 'Social', 'Intellectual', 'Physical', 'Romantic'];

// Helper to normalize category
function normalizeCategory(category) {
    if (!category) return null;
    const lower = category.toLowerCase();
    return VALID_CATEGORIES.find(c => c.toLowerCase() === lower) || null;
}

// Get single goal (for editing)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user.user_id;

    try {
        const goal = await db('goals')
            .where({ goal_id: id, user_id: userId })
            .first();

        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        res.json({ goal });

    } catch (error) {
        console.error('Get goal error:', error);
        res.status(500).json({ error: 'Error loading goal' });
    }
});

// Create new goal
router.post('/create', async (req, res) => {
    const { title, category, targetCount, description, deadline } = req.body;
    const userId = req.session.user.user_id;

    try {
        // Validation
        if (!title || !title.trim()) {
            throw new Error('Title is required');
        }

        const normalizedCategory = normalizeCategory(category);
        if (!normalizedCategory) {
            throw new Error('Invalid category. Must be: Spiritual, Social, Intellectual, Physical, or Romantic');
        }

        const target = parseInt(targetCount) || 0;
        if (target < 0) {
            throw new Error('Target count cannot be negative');
        }

        await db('goals').insert({
            user_id: userId,
            title: title.trim(),
            category: normalizedCategory,
            target_count: target,
            description: description ? description.trim() : null,
            deadline: deadline || null
        });

        req.session.success = 'Goal created successfully';
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Create goal error:', error);
        req.session.error = 'Error creating goal: ' + error.message;
        res.redirect('/dashboard');
    }
});

// Update goal
router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { title, category, targetCount, currentCount, description, deadline, isCompleted } = req.body;
    const userId = req.session.user.user_id;

    try {
        // If only updating completion status (from toggle button)
        if (isCompleted !== undefined && !title) {
            const completed = isCompleted === 'true' || isCompleted === true;
            await db('goals')
                .where({ goal_id: id, user_id: userId })
                .update({ is_completed: completed });
            return res.status(200).json({ success: true });
        }

        // Full update validation
        if (!title || !title.trim()) {
            throw new Error('Title is required');
        }

        const normalizedCategory = normalizeCategory(category);
        if (!normalizedCategory) {
            throw new Error('Invalid category');
        }

        const target = parseInt(targetCount) || 0;
        const current = parseInt(currentCount) || 0;

        if (target < 0) {
            throw new Error('Target count cannot be negative');
        }
        if (current < 0) {
            throw new Error('Current count cannot be negative');
        }

        // Determine completion based on counts
        const completed = isCompleted === 'true' || isCompleted === true || (target > 0 && current >= target);

        await db('goals')
            .where({ goal_id: id, user_id: userId })
            .update({
                title: title.trim(),
                category: normalizedCategory,
                target_count: target,
                current_count: current,
                description: description ? description.trim() : null,
                deadline: deadline || null,
                is_completed: completed
            });

        req.session.success = 'Goal updated successfully';
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Update goal error:', error);
        req.session.error = 'Error updating goal: ' + error.message;
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
        // Get current goal to check bounds
        const goal = await db('goals')
            .where({ goal_id: id, user_id: userId })
            .first();

        if (!goal) {
            return res.status(404).json({ success: false, error: 'Goal not found' });
        }

        // Check if already completed
        if (goal.is_completed) {
            return res.json({
                success: true,
                message: 'Goal already completed',
                current_count: goal.current_count,
                is_completed: true
            });
        }

        // Increment and check for completion
        const newCount = goal.current_count + 1;
        const isCompleted = goal.target_count > 0 && newCount >= goal.target_count;

        await db('goals')
            .where({ goal_id: id, user_id: userId })
            .update({
                current_count: newCount,
                is_completed: isCompleted
            });

        res.json({
            success: true,
            current_count: newCount,
            target_count: goal.target_count,
            is_completed: isCompleted
        });

    } catch (error) {
        console.error('Increment goal error:', error);
        res.status(500).json({ success: false, error: 'Error updating progress' });
    }
});

// Decrement goal progress
router.post('/decrement/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user.user_id;

    try {
        const goal = await db('goals')
            .where({ goal_id: id, user_id: userId })
            .first();

        if (!goal) {
            return res.status(404).json({ success: false, error: 'Goal not found' });
        }

        // Don't go below 0
        if (goal.current_count <= 0) {
            return res.json({
                success: true,
                current_count: 0,
                is_completed: false
            });
        }

        const newCount = goal.current_count - 1;
        const isCompleted = goal.target_count > 0 && newCount >= goal.target_count;

        await db('goals')
            .where({ goal_id: id, user_id: userId })
            .update({
                current_count: newCount,
                is_completed: isCompleted
            });

        res.json({
            success: true,
            current_count: newCount,
            target_count: goal.target_count,
            is_completed: isCompleted
        });

    } catch (error) {
        console.error('Decrement goal error:', error);
        res.status(500).json({ success: false, error: 'Error updating progress' });
    }
});

module.exports = router;
