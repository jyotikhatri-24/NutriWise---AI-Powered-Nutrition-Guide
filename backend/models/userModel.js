import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    age: {
        type: Number,
        min: 0
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    weight: {
        type: Number,
        min: 0
    },
    height: {
        type: Number,
        min: 0
    },

    allergies: [{
        type: String
    }],
    activityLevel: {
        type: String,
        enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
        default: 'moderate'
    },
    dailyCalorieGoal: {
        type: Number,
        default: 2000,
        min: 500,
        max: 10000
    },
    dietaryPreferences: {
        type: String,
        default: ''
    },
    healthGoals: {
        type: String,
        default: ''
    }
}, 
{ timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
