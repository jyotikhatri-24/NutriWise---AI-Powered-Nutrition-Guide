import { useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";

const Recipe = () => {
  const [foodItem, setFoodItem] = useState("");
  const [recipeData, setRecipeData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState([]);

  const handleGetRecipe = async () => {
    setError("");
    setRecipeData(null);
    setCheckedSteps([]);
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5001/api/gemini/recipe",
        { foodItem },
        { timeout: 35000 }
      );
      setRecipeData(res.data);
    } catch (err) {
      console.error("Recipe error:", err);
      setError(
        err.response?.data?.error || 
        "Cannot generate recipe. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const recipe = recipeData?.recipe;

  const toggleStep = (index) => {
    setCheckedSteps((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Search Card with Animation */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex gap-3 transform transition-all hover:shadow-2xl hover:scale-[1.01]">
          <input
            value={foodItem}
            onChange={(e) => setFoodItem(e.target.value)}
            placeholder="Enter food item (eg. chicken tikka, pasta, biryani)"
            className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && !loading && handleGetRecipe()}
          />
          <Button 
            onClick={handleGetRecipe} 
            disabled={loading || !foodItem}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating...
              </span>
            ) : (
              "Get Recipe 🍳"
            )}
          </Button>
        </div>

        {/* Loading State with Pulse Animation */}
        {loading && (
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 p-6 rounded-xl text-center shadow-lg animate-pulse">
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-3 border-blue-600"></div>
              <div>
                <p className="text-lg font-semibold">🔄 Generating your recipe...</p>
                <p className="text-sm text-blue-600 mt-1">This may take 20-30 seconds</p>
              </div>
            </div>
          </div>
        )}

        {/* Error State with Shake Animation */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md animate-shake">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Recipe Card - Two Column Layout with Fade-in Animation */}
        {recipe && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fadeIn">
            {/* Recipe Title with Gradient */}
            <div className="text-center mb-8">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4 animate-slideDown">
                {recipe.name}
              </h2>
              
              {/* Calories Badge with Bounce */}
              {recipe.calories && (
                <div className="inline-block animate-bounce">
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-8 py-4 rounded-full shadow-lg font-bold text-xl border-2 border-green-300">
                    🔥 {recipe.calories}
                  </div>
                </div>
              )}
            </div>

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LEFT SIDE - Ingredients */}
              <div className="space-y-6 animate-slideInLeft">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]">
                  <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <span className="text-4xl">🧂</span>
                    Ingredients
                  </h3>
                  <ul className="space-y-3">
                    {(recipe.ingredients || []).map((item, i) => (
                      <li 
                        key={i} 
                        className="flex items-start gap-3 text-gray-700 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:translate-x-1 animate-fadeInUp"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        <span className="text-green-600 font-bold text-2xl min-w-[24px]">•</span>
                        <span className="flex-1 text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* RIGHT SIDE - Cooking Time + Instructions */}
              <div className="space-y-6 animate-slideInRight">
                {/* Cooking Time Section */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all">
                  <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <span className="text-4xl">⏱️</span>
                    Cooking Time
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Prep Time */}
                    {recipe.prepTime && (
                      <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                        <div className="text-center">
                          <div className="text-3xl mb-2">🔪</div>
                          <div className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-1">Prep Time</div>
                          <div className="text-2xl font-bold text-orange-600">{recipe.prepTime}</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Cook Time */}
                    {recipe.cookTime && (
                      <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                        <div className="text-center">
                          <div className="text-3xl mb-2">🍳</div>
                          <div className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-1">Cook Time</div>
                          <div className="text-2xl font-bold text-orange-600">{recipe.cookTime}</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Total Time - Full Width */}
                    {recipe.totalTime && (
                      <div className="col-span-2 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl p-5 shadow-md border-2 border-orange-300">
                        <div className="text-center">
                          <div className="text-4xl mb-2">⏰</div>
                          <div className="text-sm text-gray-700 font-semibold uppercase tracking-wide mb-1">Total Time</div>
                          <div className="text-3xl font-bold text-orange-700">{recipe.totalTime}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Servings */}
                  {recipe.servings && (
                    <div className="mt-4 bg-white rounded-xl p-4 shadow-md text-center">
                      <span className="text-2xl mr-2">🍽️</span>
                      <span className="text-lg font-semibold text-gray-700">
                        Servings: <span className="text-orange-600">{recipe.servings}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Cooking Instructions */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all">
                  <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <span className="text-4xl">👩‍🍳</span>
                    Cooking Instructions
                  </h3>
                  <div className="space-y-3">
                    {(recipe.instructions || []).map((step, i) => (
                      <label
                        key={i}
                        className={`flex items-start gap-4 p-5 rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md transform hover:translate-x-1 animate-fadeInUp ${
                          checkedSteps.includes(i)
                            ? "bg-green-100 border-2 border-green-400 scale-[0.98]"
                            : "bg-white hover:bg-blue-50 border-2 border-transparent"
                        }`}
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        <input
                          type="checkbox"
                          checked={checkedSteps.includes(i)}
                          onChange={() => toggleStep(i)}
                          className="mt-1 w-6 h-6 accent-green-600 cursor-pointer transform transition-all hover:scale-110"
                        />
                        <div className="flex-1">
                          <span className="font-bold text-green-700 text-lg mr-2">
                            Step {i + 1}:
                          </span>
                          <span className={`text-lg ${checkedSteps.includes(i) ? "line-through text-gray-500" : "text-gray-700"}`}>
                            {step}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out backwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Recipe;