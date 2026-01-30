import Calorie from '../models/Calorie.js';
import User from '../models/userModel.js';
import { validationResult } from 'express-validator';

// @desc    Log daily calories
// @route   POST /api/calories
// @access  Private
export const logCalories = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { date, calories } = req.body;
        
        // Check if entry exists for this date
        let calorieEntry = await Calorie.findOne({
            user: req.user.id,
            date: new Date(date)
        });

        if (calorieEntry) {
            // Update existing entry
            calorieEntry.calories = calories;
        } else {
            // Create new entry
            calorieEntry = new Calorie({
                user: req.user.id,
                date: new Date(date),
                calories
            });
        }

        await calorieEntry.save();
        
        res.json(calorieEntry);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get calories for a specific date
// @route   GET /api/calories/:date
// @access  Private
export const getCaloriesByDate = async (req, res) => {
    try {
        const date = new Date(req.params.date);
        const entry = await Calorie.findOne({
            user: req.user.id,
            date: {
                $gte: new Date(date.setHours(0, 0, 0, 0)),
                $lt: new Date(date.setHours(23, 59, 59, 999))
            }
        });

        res.json(entry || { calories: 0 });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get calories for a month
// @route   GET /api/calories/month/:year/:month
// @access  Private
export const getCaloriesByMonth = async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        const month = parseInt(req.params.month) - 1; // JS months are 0-indexed
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        const entries = await Calorie.find({
            user: req.user.id,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ date: 1 });

        // Create a map of date to calories
        const calorieMap = new Map();
        entries.forEach(entry => {
            const dateStr = entry.date.toISOString().split('T')[0];
            calorieMap.set(dateStr, entry.calories);
        });

        res.json(Object.fromEntries(calorieMap));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update user's daily calorie goal
// @route   PUT /api/calories/goal
// @access  Private
export const updateCalorieGoal = async (req, res) => {
    try {
        const { goal } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.dailyCalorieGoal = goal;
        await user.save();

        res.json({ dailyCalorieGoal: user.dailyCalorieGoal });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
