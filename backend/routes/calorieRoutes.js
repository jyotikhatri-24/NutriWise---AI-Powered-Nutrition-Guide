import express from 'express';
import { check } from 'express-validator';
import auth from '../middleware/auth.js';
import {
    logCalories,
    getCaloriesByDate,
    getCaloriesByMonth,
    updateCalorieGoal
} from '../controllers/calorieController.js';

const router = express.Router();

// @route   POST api/calories
// @desc    Log daily calories
// @access  Private
router.post(
    '/',
    [
        auth,
        [
            check('date', 'Date is required').not().isEmpty(),
            check('calories', 'Calories must be a positive number').isFloat({ min: 0 })
        ]
    ],
    logCalories
);

// @route   GET api/calories/:date
// @desc    Get calories for a specific date
// @access  Private
router.get('/:date', auth, getCaloriesByDate);

// @route   GET api/calories/month/:year/:month
// @desc    Get calories for a month
// @access  Private
router.get('/month/:year/:month', auth, getCaloriesByMonth);

// @route   PUT api/calories/goal
// @desc    Update user's daily calorie goal
// @access  Private
router.put(
    '/goal',
    [
        auth,
        [
            check('goal', 'Calorie goal must be a positive number')
                .isInt({ min: 1, max: 10000 })
        ]
    ],
    updateCalorieGoal
);

export default router;
