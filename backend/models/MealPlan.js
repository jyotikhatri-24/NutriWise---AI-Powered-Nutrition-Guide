import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    calories: { type: Number, required: true }
});

const dayMealPlanSchema = new mongoose.Schema({
    breakfast: { type: mealSchema, required: true },
    lunch: { type: mealSchema, required: true },
    dinner: { type: mealSchema, required: true },
    snacks: { type: mealSchema, required: true }
});

const mealPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dietType: {
        type: String,
        enum: ['regular', 'vegetarian', 'vegan', 'keto', 'paleo'],
        required: true
    },
    fitnessGoal: {
        type: String,
        enum: ['weight_loss', 'weight_gain', 'muscle_gain', 'maintenance', 'general_fitness'],
        required: true
    },
    region: {
        type: String,
        required: true
    },
    currentWeight: {
        type: Number,
        required: true,
        min: 30,
        max: 200
    },
    targetWeight: {
        type: Number,
        required: true,
        min: 30,
        max: 200
    },
    height: {
        type: Number,
        required: true,
        min: 100,
        max: 250
    },
    allergies: [String],
    monday: { type: dayMealPlanSchema, required: true },
    tuesday: { type: dayMealPlanSchema, required: true },
    wednesday: { type: dayMealPlanSchema, required: true },
    thursday: { type: dayMealPlanSchema, required: true },
    friday: { type: dayMealPlanSchema, required: true },
    saturday: { type: dayMealPlanSchema, required: true },
    sunday: { type: dayMealPlanSchema, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

mealPlanSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('MealPlan', mealPlanSchema);
