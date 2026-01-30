import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
    // Using req.userId from the isAuthenticated middleware
    const user = await User.findById(req.userId);
    
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user) {
        user.fullname = req.body.fullname || user.fullname;
        user.age = req.body.age !== undefined ? req.body.age : user.age;
        user.height = req.body.height !== undefined ? req.body.height : user.height;
        user.weight = req.body.weight !== undefined ? req.body.weight : user.weight;
        user.dietaryPreferences = req.body.dietaryPreferences || user.dietaryPreferences;
        user.healthGoals = req.body.healthGoals || user.healthGoals;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            fullname: updatedUser.fullname,
            email: updatedUser.email,
            age: updatedUser.age,
            height: updatedUser.height,
            weight: updatedUser.weight,
            dietaryPreferences: updatedUser.dietaryPreferences,
            healthGoals: updatedUser.healthGoals
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
    // Using req.userId from the isAuthenticated middleware
    const user = await User.findById(req.userId).select('-password');
    
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});
