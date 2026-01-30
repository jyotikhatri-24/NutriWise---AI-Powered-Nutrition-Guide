import axios from 'axios';
import { API_URL } from '../config';

// Get user profile
const getProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/api/auth/me`, config);
  return response.data;
};

// Update user profile
const updateProfile = async (profileData, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/api/auth/me`,
    profileData,
    config
  );

  return response.data;
};

const userService = {
  getProfile,
  updateProfile,
};

export default userService;
