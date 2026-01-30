import MealPlan from "../models/MealPlan.js";

/* ================= OLLAMA AI WITH TIMEOUT ================= */
async function runAI(prompt, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: "llama3",
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 2000, // INCREASED for full week generation
        }
      }),
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.response;
    
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('AI request timeout - try a simpler request');
    }
    throw error;
  }
}

/* ================= IMPROVED JSON PARSER ================= */
function parseJSON(text) {
  // Remove markdown code blocks if present
  let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  
  if (start === -1 || end === -1) {
    console.error("❌ RAW AI RESPONSE:", text);
    throw new Error("No JSON found in response");
  }
  
  try {
    const jsonStr = cleaned.slice(start, end + 1);
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("❌ PARSE ERROR:", e.message);
    console.error("❌ ATTEMPTED TO PARSE:", cleaned.slice(start, end + 1));
    throw new Error("Invalid JSON structure");
  }
}

/* ================= FALLBACK FUNCTION ================= */
function getFallbackMealPlan(dietType, region, fitnessGoal) {
  const templates = {
    vegetarian: {
      indian: {
        monday: {
          breakfast: { name: "Poha with vegetables and peanuts", calories: 300 },
          lunch: { name: "Dal tadka with jeera rice", calories: 450 },
          dinner: { name: "Paneer butter masala with roti", calories: 500 },
          snacks: { name: "Fruit salad with chat masala", calories: 120 }
        },
        tuesday: {
          breakfast: { name: "Idli sambar with coconut chutney", calories: 280 },
          lunch: { name: "Chole with brown rice", calories: 480 },
          dinner: { name: "Mixed vegetable curry with chapati", calories: 450 },
          snacks: { name: "Roasted makhana", calories: 100 }
        },
        wednesday: {
          breakfast: { name: "Upma with vegetables", calories: 290 },
          lunch: { name: "Rajma curry with rice", calories: 500 },
          dinner: { name: "Palak paneer with roti", calories: 480 },
          snacks: { name: "Sprouted moong salad", calories: 130 }
        },
        thursday: {
          breakfast: { name: "Methi thepla with curd", calories: 310 },
          lunch: { name: "Kadhi pakora with rice", calories: 470 },
          dinner: { name: "Aloo gobi with chapati", calories: 440 },
          snacks: { name: "Masala peanuts", calories: 150 }
        },
        friday: {
          breakfast: { name: "Dosa with sambar", calories: 300 },
          lunch: { name: "Paneer tikka masala with naan", calories: 520 },
          dinner: { name: "Vegetable biryani", calories: 550 },
          snacks: { name: "Mixed fruit bowl", calories: 110 }
        },
        saturday: {
          breakfast: { name: "Paratha with potato stuffing", calories: 350 },
          lunch: { name: "Malai kofta with rice", calories: 540 },
          dinner: { name: "Dal makhani with roti", calories: 490 },
          snacks: { name: "Roasted chana", calories: 120 }
        },
        sunday: {
          breakfast: { name: "Puri bhaji", calories: 380 },
          lunch: { name: "Paneer pulao with raita", calories: 510 },
          dinner: { name: "Mixed dal with jeera rice", calories: 460 },
          snacks: { name: "Vegetable pakora", calories: 160 }
        }
      },
      italian: {
        monday: {
          breakfast: { name: "Avocado toast with tomatoes", calories: 300 },
          lunch: { name: "Margherita pizza", calories: 480 },
          dinner: { name: "Pasta primavera", calories: 500 },
          snacks: { name: "Caprese salad", calories: 140 }
        },
        tuesday: {
          breakfast: { name: "Bruschetta with olive oil", calories: 280 },
          lunch: { name: "Vegetable lasagna", calories: 520 },
          dinner: { name: "Penne arrabbiata", calories: 460 },
          snacks: { name: "Mixed olives and nuts", calories: 150 }
        },
        wednesday: {
          breakfast: { name: "Italian focaccia with herbs", calories: 310 },
          lunch: { name: "Eggplant parmigiana", calories: 500 },
          dinner: { name: "Mushroom risotto", calories: 480 },
          snacks: { name: "Fresh mozzarella", calories: 130 }
        },
        thursday: {
          breakfast: { name: "Tomato basil omelet", calories: 290 },
          lunch: { name: "Vegetable minestrone soup", calories: 350 },
          dinner: { name: "Spinach ravioli", calories: 510 },
          snacks: { name: "Grissini breadsticks", calories: 120 }
        },
        friday: {
          breakfast: { name: "Panini with vegetables", calories: 320 },
          lunch: { name: "Quattro formaggi pizza", calories: 550 },
          dinner: { name: "Fettuccine alfredo", calories: 580 },
          snacks: { name: "Bruschetta", calories: 140 }
        },
        saturday: {
          breakfast: { name: "Italian frittata", calories: 300 },
          lunch: { name: "Pesto pasta with pine nuts", calories: 530 },
          dinner: { name: "Vegetable pizza", calories: 490 },
          snacks: { name: "Tiramisu (small)", calories: 200 }
        },
        sunday: {
          breakfast: { name: "Cannoli for brunch", calories: 350 },
          lunch: { name: "Gnocchi with tomato sauce", calories: 480 },
          dinner: { name: "Vegetable calzone", calories: 520 },
          snacks: { name: "Gelato", calories: 180 }
        }
      }
    },
    regular: {
      indian: {
        monday: {
          breakfast: { name: "Egg paratha with curd", calories: 350 },
          lunch: { name: "Chicken curry with rice", calories: 550 },
          dinner: { name: "Dal and roti with salad", calories: 450 },
          snacks: { name: "Samosa", calories: 200 }
        },
        tuesday: {
          breakfast: { name: "Masala dosa with chutney", calories: 320 },
          lunch: { name: "Butter chicken with naan", calories: 600 },
          dinner: { name: "Fish curry with rice", calories: 520 },
          snacks: { name: "Bhel puri", calories: 180 }
        },
        wednesday: {
          breakfast: { name: "Aloo paratha with pickle", calories: 360 },
          lunch: { name: "Mutton biryani", calories: 620 },
          dinner: { name: "Paneer tikka with roti", calories: 480 },
          snacks: { name: "Vada pav", calories: 210 }
        },
        thursday: {
          breakfast: { name: "Poha with boiled egg", calories: 330 },
          lunch: { name: "Chicken biryani", calories: 580 },
          dinner: { name: "Dal makhani with rice", calories: 490 },
          snacks: { name: "Kachori", calories: 220 }
        },
        friday: {
          breakfast: { name: "Upma with egg bhurji", calories: 340 },
          lunch: { name: "Fish fry with rice", calories: 560 },
          dinner: { name: "Chicken korma with roti", calories: 530 },
          snacks: { name: "Pakora", calories: 190 }
        },
        saturday: {
          breakfast: { name: "Puri bhaji with aloo", calories: 380 },
          lunch: { name: "Lamb curry with naan", calories: 640 },
          dinner: { name: "Egg curry with rice", calories: 500 },
          snacks: { name: "Spring rolls", calories: 200 }
        },
        sunday: {
          breakfast: { name: "Chole bhature", calories: 400 },
          lunch: { name: "Chicken tandoori with rice", calories: 590 },
          dinner: { name: "Mixed dal with chapati", calories: 460 },
          snacks: { name: "Paneer tikka", calories: 210 }
        }
      }
    }
  };

  // Adjust calories based on fitness goal
  const adjustCalories = (meal, goal) => {
    let multiplier = 1;
    if (goal === 'weight_loss') multiplier = 0.85;
    if (goal === 'weight_gain' || goal === 'muscle_gain') multiplier = 1.15;
    
    return {
      ...meal,
      calories: Math.round(meal.calories * multiplier)
    };
  };

  const dietMeals = templates[dietType] || templates.regular;
  const regionMeals = dietMeals[region] || dietMeals.indian;

  // Apply calorie adjustments to all meals
  const adjustedPlan = {};
  Object.keys(regionMeals).forEach(day => {
    adjustedPlan[day] = {};
    Object.keys(regionMeals[day]).forEach(meal => {
      adjustedPlan[day][meal] = adjustCalories(regionMeals[day][meal], fitnessGoal);
    });
  });

  return adjustedPlan;
}

/* ================= CONTROLLERS ================= */

// 🔹 RECIPE (improved)
export const generateRecipe = async (req, res) => {
  try {
    const { foodItem } = req.body;
    if (!foodItem) {
      return res.status(400).json({ error: "Food item required" });
    }

    const prompt = `You are a recipe generator. Generate a recipe for "${foodItem}".

IMPORTANT: Return ONLY a valid JSON object with no additional text, explanations, or markdown.

Format:
{
  "name": "Recipe Name",
  "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
  "instructions": ["step 1", "step 2", "step 3"],
  "calories": "approximate calories per serving",
  "prepTime": "15 minutes",
  "cookTime": "30 minutes",
  "totalTime": "45 minutes",
  "servings": "4"
}

JSON:`;

    console.log("🔄 Generating recipe for:", foodItem);
    const raw = await runAI(prompt);
    console.log("✅ Raw AI response received, length:", raw.length);
    
    const recipe = parseJSON(raw);
    
    // Validate recipe has required fields
    if (!recipe.name || !recipe.ingredients || !recipe.instructions) {
      throw new Error("Incomplete recipe data");
    }
    
    console.log("✅ Recipe generated:", recipe.name);
    res.json({ recipe });
    
  } catch (error) {
    console.error("❌ Recipe generation error:", error.message);
    res.status(500).json({ 
      error: "Cannot generate recipe", 
      details: error.message 
    });
  }
};

// 🔹 ANALYZE FOOD
export const analyzeFood = async (req, res) => {
  try {
    const { food } = req.body;
    if (!food) {
      return res.status(400).json({ error: "Food required" });
    }

    const prompt = `Analyze nutritional info for "${food}".

Return ONLY valid JSON with no extra text:
{
  "calories": "number",
  "protein": "number in grams",
  "carbs": "number in grams",
  "fat": "number in grams"
}

JSON:`;

    const raw = await runAI(prompt);
    const data = parseJSON(raw);
    res.json(data);
  } catch (error) {
    console.error("❌ Analyze error:", error.message);
    res.status(500).json({ error: "Cannot analyze food" });
  }
};

// 🔹 OPTIMIZED MEAL PLAN - GENERATES ENTIRE WEEK IN ONE CALL
export const generateMealPlan = async (req, res) => {
  try {
    const { dietType, fitnessGoal, region, allergies, targetWeight, currentWeight, height, userId } = req.body;
    
    console.log("🔄 Generating meal plan for user:", userId);
    console.log("📋 Preferences:", { dietType, fitnessGoal, region });

    // Calculate calorie target based on fitness goal
    let calorieTarget = 2000; // default
    if (fitnessGoal === 'weight_loss') calorieTarget = 1600;
    if (fitnessGoal === 'weight_gain') calorieTarget = 2400;
    if (fitnessGoal === 'muscle_gain') calorieTarget = 2600;

    // OPTIMIZED: Generate entire week in ONE API call
    const prompt = `Generate a complete 7-day meal plan.

Diet: ${dietType || 'regular'}
Goal: ${fitnessGoal || 'maintenance'}
Cuisine: ${region || 'indian'}
Allergies: ${allergies?.join(', ') || 'none'}
Daily Calorie Target: ${calorieTarget} kcal

IMPORTANT: Return ONLY valid JSON. No explanations, no markdown.

Format:
{
  "monday": {
    "breakfast": {"name": "dish name", "calories": 300},
    "lunch": {"name": "dish name", "calories": 500},
    "dinner": {"name": "dish name", "calories": 550},
    "snacks": {"name": "snack name", "calories": 150}
  },
  "tuesday": {
    "breakfast": {"name": "dish name", "calories": 300},
    "lunch": {"name": "dish name", "calories": 500},
    "dinner": {"name": "dish name", "calories": 550},
    "snacks": {"name": "snack name", "calories": 150}
  },
  "wednesday": {
    "breakfast": {"name": "dish name", "calories": 300},
    "lunch": {"name": "dish name", "calories": 500},
    "dinner": {"name": "dish name", "calories": 550},
    "snacks": {"name": "snack name", "calories": 150}
  },
  "thursday": {
    "breakfast": {"name": "dish name", "calories": 300},
    "lunch": {"name": "dish name", "calories": 500},
    "dinner": {"name": "dish name", "calories": 550},
    "snacks": {"name": "snack name", "calories": 150}
  },
  "friday": {
    "breakfast": {"name": "dish name", "calories": 300},
    "lunch": {"name": "dish name", "calories": 500},
    "dinner": {"name": "dish name", "calories": 550},
    "snacks": {"name": "snack name", "calories": 150}
  },
  "saturday": {
    "breakfast": {"name": "dish name", "calories": 300},
    "lunch": {"name": "dish name", "calories": 500},
    "dinner": {"name": "dish name", "calories": 550},
    "snacks": {"name": "snack name", "calories": 150}
  },
  "sunday": {
    "breakfast": {"name": "dish name", "calories": 300},
    "lunch": {"name": "dish name", "calories": 500},
    "dinner": {"name": "dish name", "calories": 550},
    "snacks": {"name": "snack name", "calories": 150}
  }
}

JSON:`;

    let mealPlan;
    
    try {
      console.log("🤖 Calling AI to generate full week meal plan...");
      const raw = await runAI(prompt, 45000); // 45 second timeout for full week
      console.log("✅ AI response received, parsing...");
      mealPlan = parseJSON(raw);
      console.log("✅ Meal plan parsed successfully");
    } catch (error) {
      console.error("❌ AI generation failed, using fallback template:", error.message);
      // Use fallback if AI fails
      mealPlan = getFallbackMealPlan(dietType || 'regular', region || 'indian', fitnessGoal);
    }

    // Validate meal plan structure
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const validatedPlan = {};
    
    days.forEach(day => {
      if (mealPlan[day]) {
        validatedPlan[day] = mealPlan[day];
      } else {
        // Use fallback for missing days
        const fallback = getFallbackMealPlan(dietType || 'regular', region || 'indian', fitnessGoal);
        validatedPlan[day] = fallback[day];
      }
    });

    // Save to database
    const doc = await MealPlan.findOneAndUpdate(
      { userId },
      { 
        userId, 
        dietType, 
        fitnessGoal, 
        region, 
        allergies: allergies || [], 
        targetWeight, 
        currentWeight,
        height,
        ...validatedPlan 
      },
      { new: true, upsert: true }
    );

    console.log("✅ Meal plan saved successfully");
    res.json(doc);
    
  } catch (error) {
    console.error("❌ Meal plan generation error:", error.message);
    res.status(500).json({ 
      error: "Cannot generate meal plan", 
      details: error.message 
    });
  }
};

// 🔹 GET SAVED PLAN
export const getUserMealPlan = async (req, res) => {
  try {
    const plan = await MealPlan.findOne({ userId: req.params.userId });
    
    if (!plan) {
      return res.status(404).json({ error: "No meal plan found for this user" });
    }
    
    res.json({ mealPlan: plan });
  } catch (error) {
    console.error("❌ Get meal plan error:", error.message);
    res.status(500).json({ error: "Cannot fetch meal plan" });
  }
};

// 🔹 GENERATE FOOD IMAGE
export const generateFoodImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt required" });
    }

    // Using Pollinations.ai (Free, no API key needed)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true`;
    
    res.json({ imageUrl });

  } catch (error) {
    console.error("❌ Image generation error:", error.message);
    res.status(500).json({ error: "Cannot generate image" });
  }
};