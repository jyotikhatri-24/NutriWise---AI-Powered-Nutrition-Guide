import express from 'express';
import { 
  analyzeFood, 
  generateMealPlan, 
  getUserMealPlan, 
  generateRecipe,
  generateFoodImage  // Add this line
} from '../controllers/geminiController.js';

const router = express.Router();

// Protected routes - require authentication
router.post('/analyze', analyzeFood);
router.post('/meal-plan', generateMealPlan);
router.get('/meal-plan/:userId', getUserMealPlan);
router.post('/recipe', generateRecipe);
router.post('/generate-image', generateFoodImage);  // Add this line

export default router;