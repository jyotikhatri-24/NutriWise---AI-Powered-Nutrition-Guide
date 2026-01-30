import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Droplet, Utensils, Moon, Plus, Minus, TrendingUp, Award } from 'lucide-react';

const HealthTracker = () => {
  const [waterIntake, setWaterIntake] = useState(0);
  const [calories, setCalories] = useState(0);
  const [sleepHours, setSleepHours] = useState(7);
  const [showConfetti, setShowConfetti] = useState(false);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('healthMetrics');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      const today = new Date().toISOString().split('T')[0];
      
      if (parsedData.date === today) {
        setWaterIntake(parsedData.water || 0);
        setCalories(parsedData.calories || 0);
        setSleepHours(parsedData.sleep || 7);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const todayMetrics = {
      water: waterIntake,
      calories,
      sleep: sleepHours,
      date: new Date().toISOString().split('T')[0]
    };
    
    localStorage.setItem('healthMetrics', JSON.stringify(todayMetrics));
  }, [waterIntake, calories, sleepHours]);

  const addWater = () => {
    setWaterIntake(prev => {
      const newValue = Math.min(prev + 250, 4000);
      if (newValue >= 2000 && prev < 2000) {
        triggerCelebration();
      }
      return newValue;
    });
  };

  const removeWater = () => setWaterIntake(prev => Math.max(prev - 250, 0));
  
  const addCalories = () => setCalories(prev => prev + 50);
  const removeCalories = () => setCalories(prev => Math.max(prev - 50, 0));
  
  const updateSleep = (e) => setSleepHours(parseInt(e.target.value) || 0);

  const calculateWaterPercentage = () => Math.min((waterIntake / 2000) * 100, 100);
  const calculateCaloriePercentage = () => Math.min((calories / 2000) * 100, 100);
  const calculateSleepPercentage = () => Math.min((sleepHours / 9) * 100, 100);

  const triggerCelebration = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const getWaterStatus = () => {
    const percentage = calculateWaterPercentage();
    if (percentage >= 100) return { text: "Goal Achieved! 🎉", color: "text-green-600" };
    if (percentage >= 75) return { text: "Almost there!", color: "text-blue-600" };
    if (percentage >= 50) return { text: "Great progress!", color: "text-blue-500" };
    return { text: "Keep going!", color: "text-gray-600" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'][Math.floor(Math.random() * 4)]
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Health Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Track your daily health metrics and stay on top of your wellness goals.
          </p>
        </div>

        {/* Achievement Banner */}
        {(calculateWaterPercentage() >= 100 || calculateCaloriePercentage() >= 100 || sleepHours >= 7) && (
          <div className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in">
            <Award className="h-6 w-6" />
            <span className="font-semibold">You're crushing your goals today! Keep it up! 🌟</span>
          </div>
        )}
        
        {/* Water Intake Card */}
        <div className="bg-white p-8 rounded-2xl shadow-xl mb-8 transform hover:scale-[1.02] transition-all duration-300 border border-blue-100 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg animate-pulse-slow">
                <Droplet className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Water Intake</h2>
                <p className={`text-sm font-medium ${getWaterStatus().color}`}>{getWaterStatus().text}</p>
              </div>
            </div>
            <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {waterIntake}ml
            </span>
          </div>

          {/* Progress Bar with Animation */}
          <div className="relative w-full bg-gray-200 rounded-full h-6 mb-4 overflow-hidden shadow-inner">
            <div 
              className="absolute h-6 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-500 transition-all duration-700 ease-out shadow-lg"
              style={{ width: `${calculateWaterPercentage()}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-shimmer"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-700 mix-blend-difference">
                {Math.round(calculateWaterPercentage())}%
              </span>
            </div>
          </div>

          <div className="flex justify-between text-sm text-gray-600 font-medium mb-6">
            <span>0ml</span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Goal: 2000ml
            </span>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={removeWater}
              className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Minus className="h-5 w-5" /> 250ml
            </button>
            <button 
              onClick={addWater}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="h-5 w-5" /> 250ml
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calorie Intake Card */}
          <div className="bg-white p-8 rounded-2xl shadow-xl transform hover:scale-[1.02] transition-all duration-300 border border-red-100 animate-fade-in-up delay-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-red-400 to-orange-600 rounded-xl shadow-lg">
                  <Utensils className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Calorie Intake</h2>
                  <p className="text-sm text-gray-600">Daily nutrition</p>
                </div>
              </div>
              <span className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                {calories}
              </span>
            </div>

            <div className="relative w-full bg-gray-200 rounded-full h-6 mb-4 overflow-hidden shadow-inner">
              <div 
                className="absolute h-6 rounded-full bg-gradient-to-r from-red-400 via-red-500 to-orange-500 transition-all duration-700 ease-out shadow-lg"
                style={{ width: `${calculateCaloriePercentage()}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-20 animate-shimmer"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700 mix-blend-difference">
                  {Math.round(calculateCaloriePercentage())}%
                </span>
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-600 font-medium mb-6">
              <span>0 kcal</span>
              <span>Goal: 2000 kcal</span>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={removeCalories}
                className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                -50 kcal
              </button>
              <button 
                onClick={addCalories}
                className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                +50 kcal
              </button>
            </div>
          </div>

          {/* Sleep Tracker Card */}
          <div className="bg-white p-8 rounded-2xl shadow-xl transform hover:scale-[1.02] transition-all duration-300 border border-purple-100 animate-fade-in-up delay-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl shadow-lg">
                  <Moon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Sleep Tracker</h2>
                  <p className="text-sm text-gray-600">Rest & recovery</p>
                </div>
              </div>
              <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {sleepHours}h
              </span>
            </div>

            <div className="relative w-full bg-gray-200 rounded-full h-6 mb-4 overflow-hidden shadow-inner">
              <div 
                className="absolute h-6 rounded-full bg-gradient-to-r from-purple-400 via-purple-500 to-pink-500 transition-all duration-700 ease-out shadow-lg"
                style={{ width: `${calculateSleepPercentage()}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-20 animate-shimmer"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700 mix-blend-difference">
                  {Math.round(calculateSleepPercentage())}%
                </span>
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-600 font-medium mb-6">
              <span>0 hrs</span>
              <span>Recommended: 7-9 hrs</span>
            </div>

            <div className="mt-6">
              <label htmlFor="sleepHours" className="block text-sm font-semibold text-gray-700 mb-3">
                Hours of Sleep Last Night:
              </label>
              <input
                type="number"
                id="sleepHours"
                min="0"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={updateSleep}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg font-semibold transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="mt-8 bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-200 animate-fade-in delay-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-green-600" />
            Today's Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 transform hover:scale-105 transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <Droplet className="h-10 w-10 text-blue-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-blue-700 mb-2">Water Intake</p>
              <p className="text-3xl font-bold text-blue-600 mb-1">{waterIntake}ml</p>
              <p className="text-xs text-gray-600 font-medium">{Math.round(calculateWaterPercentage())}% of goal</p>
            </div>
            <div className="relative text-center p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-200 transform hover:scale-105 transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-orange-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <Utensils className="h-10 w-10 text-red-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-red-700 mb-2">Calories</p>
              <p className="text-3xl font-bold text-red-600 mb-1">{calories}</p>
              <p className="text-xs text-gray-600 font-medium">{Math.round(calculateCaloriePercentage())}% of goal</p>
            </div>
            <div className="relative text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 transform hover:scale-105 transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <Moon className="h-10 w-10 text-purple-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-purple-700 mb-2">Sleep</p>
              <p className="text-3xl font-bold text-purple-600 mb-1">{sleepHours} hrs</p>
              <p className="text-xs text-gray-600 font-medium">{sleepHours >= 7 ? '✨ Great!' : '💤 Aim for 7+ hours'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes pulseSlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-confetti {
          width: 10px;
          height: 10px;
          animation: confetti 3s linear forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in {
          animation: slideIn 0.6s ease-out forwards;
        }

        .animate-pulse-slow {
          animation: pulseSlow 3s ease-in-out infinite;
        }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
};

export default HealthTracker;