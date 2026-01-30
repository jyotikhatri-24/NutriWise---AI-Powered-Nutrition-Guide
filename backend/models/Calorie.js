import mongoose from 'mongoose';

const CalorieSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    calories: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create compound index to ensure one entry per user per day
CalorieSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('Calorie', CalorieSchema);
