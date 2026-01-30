// API Base URL
export const API_BASE_URL = 'http://localhost:5001/api';

// Auth Endpoints
export const AUTH_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`
};

// Frontend Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    PROFILE: '/profile',
    LEARN_MORE: '/learn-more',
    ANALYSIS: '/analysis',
    MEAL_PLANNER: '/meal-planner',
    HEALTH_TRACKER: '/health-tracker',
    UPDATES: '/updates'
};

// Local storage keys
export const STORAGE_KEYS = {
    USER: 'nutrigen_user'
};

// Default values
export const DEFAULT_VALUES = {
    AVATAR: 'https://api.dicebear.com/7.x/avataaars/svg', // For generating default avatar images
    DAILY_CALORIE_GOAL: 2000 // Default daily calorie goal
};

// API Configuration
export const API_CONFIG = {
    headers: {
        'Content-Type': 'application/json'
    },
    credentials: 'include'
};
