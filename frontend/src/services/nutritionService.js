const API_KEY = 'Cv06Pz72aAaP6j+2suF4qQ==60uK8JwU0E2oxszp';
const BASE_URL = 'https://api.calorieninjas.com/v1/nutrition';

export const getNutritionData = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    throw error;
  }
};

export const formatNutritionData = (data) => {
  if (!data || !data.items || data.items.length === 0) {
    return null;
  }

  // Calculate totals for all items
  const totals = data.items.reduce(
    (acc, item) => {
      return {
        calories: acc.calories + (item.calories || 0),
        serving_size_g: acc.serving_size_g + (item.serving_size_g || 0),
        fat_total_g: acc.fat_total_g + (item.fat_total_g || 0),
        fat_saturated_g: acc.fat_saturated_g + (item.fat_saturated_g || 0),
        protein_g: acc.protein_g + (item.protein_g || 0),
        sodium_mg: acc.sodium_mg + (item.sodium_mg || 0),
        potassium_mg: acc.potassium_mg + (item.potassium_mg || 0),
        cholesterol_mg: acc.cholesterol_mg + (item.cholesterol_mg || 0),
        carbohydrates_total_g: acc.carbohydrates_total_g + (item.carbohydrates_total_g || 0),
        fiber_g: acc.fiber_g + (item.fiber_g || 0),
        sugar_g: acc.sugar_g + (item.sugar_g || 0),
      };
    },
    {
      calories: 0,
      serving_size_g: 0,
      fat_total_g: 0,
      fat_saturated_g: 0,
      protein_g: 0,
      sodium_mg: 0,
      potassium_mg: 0,
      cholesterol_mg: 0,
      carbohydrates_total_g: 0,
      fiber_g: 0,
      sugar_g: 0,
    }
  );

  return {
    items: data.items,
    totals,
    timestamp: new Date().toISOString(),
  };
};
