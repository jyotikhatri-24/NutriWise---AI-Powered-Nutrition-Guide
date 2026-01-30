import axios from 'axios';
import { API_BASE_URL, ENDPOINTS, ERROR_MESSAGES } from '../config';

const API_URL = API_BASE_URL + ENDPOINTS.CALORIES.BASE;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
};

const handleError = (error) => {
  if (error.response) {
    // Server responded with a status code outside 2xx
    if (error.response.status === 401) {
      // Unauthorized - token might be expired
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
    }
    throw new Error(error.response.data.message || ERROR_MESSAGES.SERVER_ERROR);
  } else if (error.request) {
    // Request made but no response
    throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
  } else {
    // Something else happened
    throw new Error(error.message || ERROR_MESSAGES.SERVER_ERROR);
  }
};

/**
 * Logs calories for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {number} calories - Number of calories to log
 * @returns {Promise<Object>} - The logged calorie data
 */
export const logCalories = async (date, calories) => {
  try {
    console.log('Sending request to:', API_URL);
    console.log('Request payload:', { date, calories: Number(calories) });
    
    const response = await axios.post(
      API_URL,
      { date, calories: Number(calories) },
      getAuthHeader()
    );
    
    console.log('Response from server:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in logCalories:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      }
    });
    return handleError(error);
  }
};

/**
 * Fetches calorie data for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} - Calorie data for the specified date
 */
export const getCaloriesByDate = async (date) => {
  try {
    const response = await axios.get(
      `${API_URL}/${date}`,
      getAuthHeader()
    );
    return response.data || { calories: 0 };
  } catch (error) {
    if (error.response?.status === 404) {
      return { calories: 0 }; // Return default if no entry exists
    }
    return handleError(error);
  }
};

/**
 * Fetches calorie data for a specific month
 * @param {number} year - Full year (e.g., 2023)
 * @param {number} month - Month (1-12)
 * @returns {Promise<Object>} - Object with dates as keys and calorie counts as values
 */
export const getCaloriesByMonth = async (year, month) => {
  try {
    const response = await axios.get(
      `${API_URL}/month/${year}/${month}`,
      getAuthHeader()
    );
    return response.data || {};
  } catch (error) {
    if (error.response?.status === 404) {
      return {}; // Return empty object if no entries exist
    }
    return handleError(error);
  }
};

/**
 * Updates the user's daily calorie goal
 * @param {number} goal - New daily calorie goal
 * @returns {Promise<Object>} - Updated user data
 */
export const updateCalorieGoal = async (goal) => {
  try {
    const response = await axios.put(
      API_BASE_URL + ENDPOINTS.CALORIES.GOAL,
      { goal: Number(goal) },
      getAuthHeader()
    );
    
    // Update local user data
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      user.dailyCalorieGoal = goal;
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Gets the user's current daily calorie goal
 * @returns {Promise<number>} - Daily calorie goal
 */
export const getCalorieGoal = async () => {
  try {
    // First try to get from local storage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.dailyCalorieGoal) {
      return user.dailyCalorieGoal;
    }
    
    // If not in local storage, fetch from server
    const response = await axios.get(
      API_BASE_URL + ENDPOINTS.CALORIES.GOAL,
      getAuthHeader()
    );
    
    // Update local storage
    if (response.data?.dailyCalorieGoal && user) {
      user.dailyCalorieGoal = response.data.dailyCalorieGoal;
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data?.dailyCalorieGoal || 2000;
  } catch (error) {
    console.error('Error fetching calorie goal:', error);
    return 2000; // Default value
  }
};
