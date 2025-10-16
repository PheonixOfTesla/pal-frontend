import axios from 'axios';

// API Base URL - CHANGE THIS TO YOUR BACKEND
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('phoenix-auth');
    if (authData) {
      const { token } = JSON.parse(authData).state;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('phoenix-auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH SERVICES
// ============================================
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// ============================================
// INTELLIGENCE SERVICES
// ============================================
export const intelligenceService = {
  getHealthMetrics: async (userId) => {
    const response = await api.get(`/intelligence/${userId}`);
    return response.data;
  },
};

// ============================================
// WEARABLE SERVICES
// ============================================
export const wearableService = {
  getConnections: async () => {
    const response = await api.get('/wearables/connections');
    return response.data;
  },
  
  connectDevice: async (provider) => {
    const response = await api.post(`/wearables/connect/${provider}`);
    return response.data;
  },
  
  syncData: async (provider) => {
    const response = await api.post(`/wearables/sync/${provider}`);
    return response.data;
  },
  
  getWearableData: async (userId, days = 7) => {
    const response = await api.get(`/wearables/user/${userId}`, { params: { days } });
    return response.data;
  },
};

// ============================================
// WORKOUT SERVICES
// ============================================
export const workoutService = {
  getWorkouts: async (clientId) => {
    const response = await api.get(`/workouts/client/${clientId}`);
    return response.data;
  },
  
  completeWorkout: async (workoutId, data) => {
    const response = await api.post(`/workouts/${workoutId}/complete`, data);
    return response.data;
  },
};

// ============================================
// GOAL SERVICES
// ============================================
export const goalService = {
  getGoals: async (clientId) => {
    const response = await api.get(`/goals/client/${clientId}`);
    return response.data;
  },
  
  updateGoal: async (goalId, data) => {
    const response = await api.put(`/goals/${goalId}`, data);
    return response.data;
  },
};

export default api;