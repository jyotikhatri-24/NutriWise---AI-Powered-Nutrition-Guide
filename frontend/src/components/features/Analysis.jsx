import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Loader2, Plus, Utensils, Flame, TrendingUp, Apple, Clock, CheckCircle2, Sparkles } from "lucide-react";
import { getNutritionData, formatNutritionData } from '../../services/nutritionService';
import { logCalories, getCaloriesByDate } from '../../services/calorieService';
import { toast } from 'react-toastify';

const Analysis = () => {
    const [foodItem, setFoodItem] = useState('');
    const [loading, setLoading] = useState(false);
    const [nutritionData, setNutritionData] = useState(null);
    const [error, setError] = useState(null);
    const [searchHistory, setSearchHistory] = useState([]);
    const [caloriesConsumed, setCaloriesConsumed] = useState(0);
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

    // Load search history from localStorage and fetch today's calories on component mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('nutritionSearchHistory');
        if (savedHistory) {
            setSearchHistory(JSON.parse(savedHistory));
        }

        const fetchTodaysCalories = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                const response = await getCaloriesByDate(today);
                if (response && response.calories) {
                    setCaloriesConsumed(response.calories);
                }
            } catch (error) {
                console.error('Error fetching today\'s calories:', error);
            }
        };

        fetchTodaysCalories();
    }, []);

    const analyzeFood = async () => {
        if (!foodItem.trim()) {
            setError('Please enter a food item');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await getNutritionData(foodItem);
            const formattedData = formatNutritionData(data);
            
            if (formattedData) {
                setNutritionData(formattedData);
                const newHistory = [
                    { query: foodItem, timestamp: new Date().toISOString() },
                    ...searchHistory.filter(item => item.query.toLowerCase() !== foodItem.toLowerCase())
                ].slice(0, 5);
                
                setSearchHistory(newHistory);
                localStorage.setItem('nutritionSearchHistory', JSON.stringify(newHistory));
            } else {
                throw new Error('No nutrition data found');
            }
        } catch (err) {
            setError('Failed to analyze food. Please try again with a different query.');
            console.error('Analysis error:', err);
            toast.error('Failed to analyze food');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        analyzeFood();
    };

    const handleAddToCalories = async (calories) => {
        const caloriesToAdd = Math.round(calories);
        
        try {
            const today = new Date().toISOString().split('T')[0];
            await logCalories(today, caloriesToAdd);
            
            setCaloriesConsumed(prev => prev + caloriesToAdd);
            setShowSuccessAnimation(true);
            setTimeout(() => setShowSuccessAnimation(false), 2000);
            
            toast.success(`🎉 ${caloriesToAdd} calories added!`);
        } catch (error) {
            console.error('Error adding calories:', error);
            toast.error(`Failed to save calories: ${error.message || 'Unknown error'}`);
        }
    };

    const handleHistoryClick = (query) => {
        setFoodItem(query);
        setTimeout(() => {
            document.querySelector('form').requestSubmit();
        }, 0);
    };

    // Calculate macro percentages
    const getMacroPercentages = () => {
        if (!nutritionData) return null;
        
        const protein = nutritionData.totals.protein_g * 4; // 4 cal per gram
        const carbs = nutritionData.totals.carbohydrates_total_g * 4;
        const fat = nutritionData.totals.fat_total_g * 9; // 9 cal per gram
        const total = protein + carbs + fat;
        
        return {
            protein: Math.round((protein / total) * 100) || 0,
            carbs: Math.round((carbs / total) * 100) || 0,
            fat: Math.round((fat / total) * 100) || 0
        };
    };

    const macroPercentages = getMacroPercentages();

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
            <Navbar />
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Apple className="w-10 h-10 text-green-600" />
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                    Nutrition Analysis
                                </h1>
                            </div>
                            <p className="text-gray-600 text-lg">
                                Get detailed nutritional information for any food item 🍎
                            </p>
                        </div>
                        {caloriesConsumed > 0 && (
                            <div className={`bg-gradient-to-br from-green-500 to-blue-500 text-white p-6 rounded-2xl shadow-xl transform transition-all hover:scale-105 ${showSuccessAnimation ? 'animate-bounce' : ''}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <Flame className="w-5 h-5" />
                                    <p className="text-sm font-medium opacity-90">Today's Calories</p>
                                </div>
                                <p className="text-4xl font-extrabold">
                                    {caloriesConsumed}
                                </p>
                                <p className="text-sm opacity-80">kcal consumed</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Search Card */}
                        <Card className="shadow-xl border-0 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Utensils className="h-6 w-6" />
                                    Analyze Food
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Input
                                            type="text"
                                            placeholder="E.g., 100g chicken breast, 1 medium apple, 2 cups rice"
                                            value={foodItem}
                                            onChange={(e) => setFoodItem(e.target.value)}
                                            className="w-full h-14 text-lg border-2 hover:border-green-400 focus:border-blue-500 transition-colors"
                                            disabled={loading}
                                        />
                                        {error && (
                                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md animate-shake">
                                                <p className="text-sm font-medium">{error}</p>
                                            </div>
                                        )}
                                    </div>
                                    <Button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg transform transition-all hover:scale-105"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="mr-2 h-5 w-5" />
                                                Analyze Food
                                            </>
                                        )}
                                    </Button>
                                </form>

                                {/* Recent Searches */}
                                {searchHistory.length > 0 && (
                                    <div className="mt-6 animate-fade-in">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Clock className="w-4 h-4 text-gray-500" />
                                            <h3 className="text-sm font-semibold text-gray-700">Recent Searches</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {searchHistory.map((item, index) => (
                                                <Button
                                                    key={index}
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleHistoryClick(item.query)}
                                                    className="bg-green-50 text-green-700 hover:bg-green-100 border-2 border-green-200 hover:border-green-400 transition-all transform hover:scale-105"
                                                >
                                                    {item.query}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Nutrition Facts Card */}
                        {nutritionData && (
                            <Card className="shadow-xl border-0 animate-fade-in-up">
                                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                                    <CardTitle className="text-2xl flex items-center gap-2">
                                        <Flame className="w-6 h-6" />
                                        Nutrition Facts
                                    </CardTitle>
                                    <p className="text-sm opacity-90 mt-1">
                                        For: <span className="font-semibold">{foodItem}</span>
                                    </p>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-6">
                                        {/* Macros Cards */}
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                <TrendingUp className="w-5 h-5 text-green-600" />
                                                Macronutrients
                                            </h3>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="relative bg-gradient-to-br from-green-400 to-green-600 p-5 rounded-2xl text-white text-center shadow-lg transform transition-all hover:scale-105 animate-pop" style={{ animationDelay: '0.1s' }}>
                                                    <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-bold">
                                                        {macroPercentages?.carbs}%
                                                    </div>
                                                    <p className="text-sm opacity-90 font-medium">Calories</p>
                                                    <p className="text-4xl font-extrabold my-2">
                                                        {Math.round(nutritionData.totals.calories)}
                                                    </p>
                                                    <p className="text-xs opacity-80">kcal</p>
                                                </div>
                                                <div className="relative bg-gradient-to-br from-blue-400 to-blue-600 p-5 rounded-2xl text-white text-center shadow-lg transform transition-all hover:scale-105 animate-pop" style={{ animationDelay: '0.2s' }}>
                                                    <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-bold">
                                                        {macroPercentages?.protein}%
                                                    </div>
                                                    <p className="text-sm opacity-90 font-medium">Protein</p>
                                                    <p className="text-4xl font-extrabold my-2">
                                                        {nutritionData.totals.protein_g.toFixed(1)}
                                                    </p>
                                                    <p className="text-xs opacity-80">grams</p>
                                                </div>
                                                <div className="relative bg-gradient-to-br from-purple-400 to-purple-600 p-5 rounded-2xl text-white text-center shadow-lg transform transition-all hover:scale-105 animate-pop" style={{ animationDelay: '0.3s' }}>
                                                    <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-bold">
                                                        {macroPercentages?.carbs}%
                                                    </div>
                                                    <p className="text-sm opacity-90 font-medium">Carbs</p>
                                                    <p className="text-4xl font-extrabold my-2">
                                                        {nutritionData.totals.carbohydrates_total_g.toFixed(1)}
                                                    </p>
                                                    <p className="text-xs opacity-80">grams</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Macro Progress Bars */}
                                        <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-semibold text-gray-700">Protein</span>
                                                    <span className="text-sm font-bold text-blue-600">{macroPercentages?.protein}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                    <div 
                                                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                                                        style={{ width: `${macroPercentages?.protein}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-semibold text-gray-700">Carbohydrates</span>
                                                    <span className="text-sm font-bold text-purple-600">{macroPercentages?.carbs}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                    <div 
                                                        className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
                                                        style={{ width: `${macroPercentages?.carbs}%`, animationDelay: '0.2s' }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-semibold text-gray-700">Fats</span>
                                                    <span className="text-sm font-bold text-orange-600">{macroPercentages?.fat}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                    <div 
                                                        className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full transition-all duration-1000 ease-out"
                                                        style={{ width: `${macroPercentages?.fat}%`, animationDelay: '0.4s' }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Detailed Nutrients */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                                            <div>
                                                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                                    Fats
                                                </h4>
                                                <ul className="space-y-2 text-sm">
                                                    <li className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
                                                        <span className="text-gray-700 font-medium">Total Fat</span>
                                                        <span className="font-bold text-gray-900">{nutritionData.totals.fat_total_g.toFixed(1)}g</span>
                                                    </li>
                                                    <li className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm pl-6">
                                                        <span className="text-gray-600">Saturated</span>
                                                        <span className="font-semibold text-gray-800">{nutritionData.totals.fat_saturated_g.toFixed(1)}g</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    Other Nutrients
                                                </h4>
                                                <ul className="space-y-2 text-sm">
                                                    <li className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
                                                        <span className="text-gray-700 font-medium">Fiber</span>
                                                        <span className="font-bold text-gray-900">{nutritionData.totals.fiber_g.toFixed(1)}g</span>
                                                    </li>
                                                    <li className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
                                                        <span className="text-gray-700 font-medium">Sugar</span>
                                                        <span className="font-bold text-gray-900">{nutritionData.totals.sugar_g.toFixed(1)}g</span>
                                                    </li>
                                                    <li className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
                                                        <span className="text-gray-700 font-medium">Sodium</span>
                                                        <span className="font-bold text-gray-900">{nutritionData.totals.sodium_mg}mg</span>
                                                    </li>
                                                    <li className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
                                                        <span className="text-gray-700 font-medium">Potassium</span>
                                                        <span className="font-bold text-gray-900">{nutritionData.totals.potassium_mg}mg</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Multiple Items Breakdown */}
                                        {nutritionData.items.length > 1 && (
                                            <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
                                                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                    <Utensils className="w-5 h-5 text-green-600" />
                                                    Items in this meal
                                                </h4>
                                                <ul className="space-y-2">
                                                    {nutritionData.items.map((item, index) => (
                                                        <li 
                                                            key={index} 
                                                            className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm transform transition-all hover:scale-105"
                                                        >
                                                            <span className="font-semibold text-gray-800">🍽️ {item.name}</span>
                                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">
                                                                {Math.round(item.calories)} kcal
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Add to Calories Button */}
                                        <Button
                                            onClick={() => handleAddToCalories(nutritionData.totals.calories)}
                                            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg transform transition-all hover:scale-105"
                                        >
                                            <Plus className="mr-2 h-5 w-5" />
                                            Add {Math.round(nutritionData.totals.calories)} Calories to Today
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Tips Card */}
                        <Card className="shadow-xl border-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    Pro Tips
                                </CardTitle>
                                <CardDescription className="text-white/90">
                                    Get the most accurate results
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg transform transition-all hover:scale-105">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-gray-700">
                                        <strong>Be specific</strong> with quantities (e.g., "1 medium banana" or "100g cooked chicken breast")
                                    </p>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg transform transition-all hover:scale-105">
                                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-gray-700">
                                        For <strong>packaged foods</strong>, include the brand name for better accuracy
                                    </p>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg transform transition-all hover:scale-105">
                                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-gray-700">
                                        You can search for <strong>multiple items</strong> at once (e.g., "1 cup rice and 100g chicken")
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        {nutritionData && (
                            <Card className="shadow-xl border-0 bg-gradient-to-br from-green-500 to-blue-500 text-white animate-fade-in">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Flame className="w-5 h-5" />
                                        Quick Stats
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="opacity-90">Calories/Protein Ratio</span>
                                        <span className="font-bold text-lg">
                                            {(nutritionData.totals.calories / nutritionData.totals.protein_g).toFixed(1)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="opacity-90">Protein %</span>
                                        <span className="font-bold text-lg">{macroPercentages?.protein}%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="opacity-90">Carbs %</span>
                                        <span className="font-bold text-lg">{macroPercentages?.carbs}%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="opacity-90">Fat %</span>
                                        <span className="font-bold text-lg">{macroPercentages?.fat}%</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
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

                @keyframes pop {
                    0% {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }

                .animate-slide-up {
                    animation: slide-up 0.6s ease-out;
                    animation-fill-mode: both;
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out;
                }

                .animate-pop {
                    animation: pop 0.5s ease-out;
                    animation-fill-mode: both;
                }

                .animate-shake {
                    animation: shake 0.5s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Analysis;
