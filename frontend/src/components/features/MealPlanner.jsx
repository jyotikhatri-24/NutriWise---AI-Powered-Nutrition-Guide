import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Loader2, Sparkles, TrendingDown, TrendingUp, Target, Utensils, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const MealPlanner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dietType: '',
    fitnessGoal: '',
    region: '',
    targetWeight: '',
    allergies: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mealPlan, setMealPlan] = useState(null);
  const [user, setUser] = useState(null);
  const [showPlan, setShowPlan] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      toast.error('Please log in to access the meal planner');
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(savedUser);
      if (!userData._id) {
        toast.error('Invalid user data. Please log in again');
        navigate('/login');
        return;
      }
      setUser(userData);
      fetchSavedMealPlan(userData._id);
    } catch (error) {
      console.error('Error parsing user data:', error);
      toast.error('Error loading user data. Please log in again');
      navigate('/login');
    }
  }, [navigate]);

  const fetchSavedMealPlan = async (userId) => {
    if (!userId) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/gemini/meal-plan/${userId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log('No saved meal plan found');
          return;
        }
        throw new Error('Failed to fetch meal plan');
      }

      const data = await response.json();
      console.log('📥 Fetched meal plan data:', data);
      
      if (data.mealPlan) {
        console.log('✅ Setting meal plan state:', data.mealPlan);
        setMealPlan(data.mealPlan);
        setShowPlan(true);
        
        // Update form with saved preferences
        setFormData({
          dietType: data.mealPlan.dietType || '',
          fitnessGoal: data.mealPlan.fitnessGoal || '',
          region: data.mealPlan.region || '',
          targetWeight: data.mealPlan.targetWeight || '',
          allergies: Array.isArray(data.mealPlan.allergies) 
            ? data.mealPlan.allergies.join(', ') 
            : ''
        });
        toast.success('Loaded your saved meal plan!');
      }
    } catch (error) {
      console.error('Error fetching meal plan:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShowPlan(false);

    if (!user?.weight || !user?.height) {
      setError('Please update your weight and height in your profile before generating a meal plan.');
      setLoading(false);
      toast.error('Missing profile information');
      return;
    }

    try {
      const allergiesArray = formData.allergies
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);

      const requestBody = {
        dietType: formData.dietType,
        fitnessGoal: formData.fitnessGoal,
        region: formData.region,
        userId: user._id,
        allergies: allergiesArray,
        targetWeight: parseFloat(formData.targetWeight),
        currentWeight: parseFloat(user.weight),
        height: parseFloat(user.height)
      };

      console.log('📤 Sending meal plan request:', requestBody);

      const response = await fetch('http://localhost:5001/api/gemini/meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('📥 Received meal plan response:', data);
      console.log('📋 Response keys:', Object.keys(data));

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to generate meal plan');
      }

      // The backend returns the meal plan directly as the data object
      setMealPlan(data);
      setShowPlan(true);
      toast.success('🎉 Meal plan generated successfully!');
      
      // Smooth scroll to meal plan
      setTimeout(() => {
        document.getElementById('meal-plan-table')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 300);

    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Day names in lowercase to match backend
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Meal types in lowercase to match backend
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
  const mealLabels = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const getMealEmoji = (mealType) => {
    const emojis = {
      breakfast: '🌅',
      lunch: '🌞',
      dinner: '🌙',
      snacks: '🍎'
    };
    return emojis[mealType] || '🍽️';
  };

  const getGoalIcon = (goal) => {
    if (!goal) return <Target className="w-4 h-4 text-gray-500" />;
    
    switch(goal) {
      case 'weight_loss':
        return <TrendingDown className="w-4 h-4 text-blue-500" />;
      case 'weight_gain':
      case 'muscle_gain':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'maintenance':
        return <Target className="w-4 h-4 text-purple-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-yellow-500" />;
    }
  };

  // Helper function to safely get meal data
  const getMealData = (day, mealType) => {
    if (!mealPlan) return null;
    
    console.log(`🔍 Looking for ${day}.${mealType}:`, mealPlan[day]?.[mealType]);
    
    // Check if day exists in meal plan
    if (mealPlan[day] && mealPlan[day][mealType]) {
      return mealPlan[day][mealType];
    }
    
    return null;
  };

  // Calculate total calories for a day
  const getDayCalories = (day) => {
    if (!mealPlan || !mealPlan[day]) return 0;
    
    return mealTypes.reduce((sum, mealType) => {
      const meal = mealPlan[day][mealType];
      const calories = meal?.calories ? parseInt(meal.calories) : 0;
      return sum + calories;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Utensils className="w-12 h-12 text-green-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Personalized Meal Plans
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            AI-powered nutrition tailored to your goals 🎯
          </p>
        </div>

        {/* Form Card */}
        <Card className="mb-8 shadow-xl border-0 animate-slide-up">
          <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="w-6 h-6" />
              Dietary Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md animate-shake">
                  <p className="font-medium">⚠️ Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Diet Type */}
                <div className="space-y-2 transform transition-all hover:scale-[1.02]">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    🥗 Diet Type
                  </label>
                  <Select
                    value={formData.dietType}
                    onValueChange={(value) => handleChange('dietType', value)}
                    required
                  >
                    <SelectTrigger className="border-2 hover:border-green-400 transition-colors h-12">
                      <SelectValue placeholder="Select diet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">🍖 Regular</SelectItem>
                      <SelectItem value="vegetarian">🥬 Vegetarian</SelectItem>
                      <SelectItem value="vegan">🌱 Vegan</SelectItem>
                      <SelectItem value="keto">🥑 Keto</SelectItem>
                      <SelectItem value="paleo">🦴 Paleo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Fitness Goal */}
                <div className="space-y-2 transform transition-all hover:scale-[1.02]">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    🎯 Fitness Goal
                  </label>
                  <Select
                    value={formData.fitnessGoal}
                    onValueChange={(value) => handleChange('fitnessGoal', value)}
                    required
                  >
                    <SelectTrigger className="border-2 hover:border-blue-400 transition-colors h-12">
                      <SelectValue placeholder="Select fitness goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight_loss">📉 Weight Loss</SelectItem>
                      <SelectItem value="weight_gain">📈 Weight Gain</SelectItem>
                      <SelectItem value="muscle_gain">💪 Muscle Gain</SelectItem>
                      <SelectItem value="maintenance">⚖️ Maintenance</SelectItem>
                      <SelectItem value="general_fitness">🏃 General Fitness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Region */}
                <div className="space-y-2 transform transition-all hover:scale-[1.02]">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    🌍 Cuisine Preference
                  </label>
                  <Select
                    value={formData.region}
                    onValueChange={(value) => handleChange('region', value)}
                    required
                  >
                    <SelectTrigger className="border-2 hover:border-purple-400 transition-colors h-12">
                      <SelectValue placeholder="Select preferred cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indian">🇮🇳 Indian</SelectItem>
                      <SelectItem value="chinese">🇨🇳 Chinese</SelectItem>
                      <SelectItem value="mediterranean">🇬🇷 Mediterranean</SelectItem>
                      <SelectItem value="mexican">🇲🇽 Mexican</SelectItem>
                      <SelectItem value="italian">🇮🇹 Italian</SelectItem>
                      <SelectItem value="japanese">🇯🇵 Japanese</SelectItem>
                      <SelectItem value="thai">🇹🇭 Thai</SelectItem>
                      <SelectItem value="american">🇺🇸 American</SelectItem>
                      <SelectItem value="middle_eastern">🌙 Middle Eastern</SelectItem>
                      <SelectItem value="korean">🇰🇷 Korean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Target Weight */}
                <div className="space-y-2 transform transition-all hover:scale-[1.02]">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    ⚖️ Target Weight (kg)
                  </label>
                  <Input
                    type="number"
                    value={formData.targetWeight}
                    onChange={(e) => handleChange('targetWeight', e.target.value)}
                    min="30"
                    max="200"
                    step="0.1"
                    required
                    placeholder="Enter target weight"
                    className="border-2 hover:border-green-400 transition-colors h-12"
                  />
                </div>

                {/* Allergies */}
                <div className="space-y-2 md:col-span-2 transform transition-all hover:scale-[1.01]">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    ⚠️ Allergies (Optional)
                  </label>
                  <Input
                    placeholder="e.g., peanuts, dairy, shellfish (comma-separated)"
                    value={formData.allergies}
                    onChange={(e) => handleChange('allergies', e.target.value)}
                    className="border-2 hover:border-red-400 transition-colors h-12"
                  />
                </div>

                {/* Current Stats */}
                {user && (
                  <div className="md:col-span-2 p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 shadow-sm">
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">Current Weight:</span>
                        <span className="text-blue-600 font-bold text-lg">{user.weight || 'N/A'} kg</span>
                      </div>
                      <div className="h-6 w-px bg-gray-300"></div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">Height:</span>
                        <span className="text-purple-600 font-bold text-lg">{user.height || 'N/A'} cm</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full md:w-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-10 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Your Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Meal Plan
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Meal Plan Table */}
        {showPlan && mealPlan && (
          <div id="meal-plan-table" className="animate-fade-in-up">
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Calendar className="w-8 h-8 text-green-600" />
                <h2 className="text-4xl font-bold text-gray-800">Your Weekly Meal Plan</h2>
              </div>
              {formData.fitnessGoal && (
                <div className="flex items-center justify-center gap-2 text-gray-600 text-lg">
                  {getGoalIcon(formData.fitnessGoal)}
                  <span className="capitalize font-medium">
                    {formData.fitnessGoal.replace('_', ' ')}
                  </span>
                </div>
              )}
            </div>

            <div className="overflow-x-auto rounded-2xl shadow-2xl mb-8">
              <table className="w-full border-collapse bg-white">
                <thead>
                  <tr className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white">
                    <th className="py-5 px-6 text-left text-base font-bold sticky left-0 bg-gradient-to-r from-green-600 to-teal-600 z-10">
                      <div className="flex items-center gap-2">
                        📅 Day
                      </div>
                    </th>
                    {mealLabels.map((meal, idx) => (
                      <th key={meal} className="py-5 px-6 text-left text-base font-bold min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getMealEmoji(mealTypes[idx])}</span>
                          <span>{meal}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map((day, dayIndex) => {
                    const dayHasMeals = mealPlan[day] && Object.keys(mealPlan[day]).length > 0;
                    
                    return (
                      <tr 
                        key={day} 
                        className={`
                          border-b border-gray-200 transition-all hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:shadow-lg
                          ${dayIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        `}
                        style={{ 
                          animation: `slideInLeft 0.5s ease-out ${dayIndex * 0.1}s both` 
                        }}
                      >
                        <td className="py-5 px-6 text-base font-bold text-gray-900 sticky left-0 bg-inherit z-10">
                          <div className="flex items-center gap-2">
                            {dayLabels[dayIndex]}
                            {!dayHasMeals && (
                              <span className="text-xs text-red-500 font-normal">(empty)</span>
                            )}
                          </div>
                        </td>
                        {mealTypes.map((mealType) => {
                          const meal = getMealData(day, mealType);
                          
                          return (
                            <td 
                              key={`${day}-${mealType}`} 
                              className="py-5 px-6 transition-all"
                            >
                              {meal && meal.name ? (
                                <div className="space-y-2 p-4 rounded-xl bg-white border-2 border-gray-200 hover:border-green-400 transition-all transform hover:scale-105 hover:shadow-lg">
                                  <p className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                                    {meal.name}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                      {meal.calories || '0'} kcal
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-gray-400 text-sm italic p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                  No meal planned
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Total Calories Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {days.map((day, idx) => {
                const totalCals = getDayCalories(day);

                return (
                  <div 
                    key={day} 
                    className="p-5 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-white"
                    style={{ animation: `fadeIn 0.6s ease-out ${idx * 0.1}s both` }}
                  >
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                      {dayLabels[idx]}
                    </p>
                    <p className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      {totalCals}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">kcal total</p>
                  </div>
                );
              })}
            </div>

            {/* Weekly Total */}
            <div className="mt-6 p-6 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl shadow-xl text-white text-center">
              <p className="text-lg font-semibold mb-2">Weekly Total Calories</p>
              <p className="text-4xl font-extrabold">
                {days.reduce((total, day) => total + getDayCalories(day), 0).toLocaleString()} kcal
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MealPlanner;