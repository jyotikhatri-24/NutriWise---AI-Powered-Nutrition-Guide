// API Configuration
export const API_URL = "http://localhost:5001";
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";


// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  CALORIE_GOAL: 'calorieGoal',
  LAST_SYNC: 'lastSync'
};

// Default Values
export const DEFAULTS = {
  DAILY_CALORIE_GOAL: 2000
};

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PROFILE: '/api/auth/me'
  },
  CALORIES: {
    BASE: '/api/calories',
    GOAL: '/api/calories/goal'
  },
  NUTRITION: {
    ANALYZE: '/api/gemini/analyze'
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.'
};
