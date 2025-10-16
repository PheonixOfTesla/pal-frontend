// src/services/api.js - COMPLETE PRODUCTION VERSION
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://pal-backend-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('phoenix-auth');
    if (authData) {
      try {
        const { token } = JSON.parse(authData).state;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('Error parsing auth data:', e);
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
      localStorage.removeItem('phoenix-auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AUTH SERVICES
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
  }
};

// INTELLIGENCE SERVICES
export const intelligenceService = {
  getHealthMetrics: async (userId) => {
    const response = await api.get(`/intelligence/${userId}`);
    return response.data;
  }
};

// WEARABLE SERVICES
export const wearableService = {
  getConnections: async () => {
    const response = await api.get('/wearables/connections');
    return response.data;
  },
  
  connectDevice: async (provider, authCode) => {
    const response = await api.post(`/wearables/connect/${provider}`, { authCode });
    return response.data;
  },
  
  syncData: async (provider) => {
    const response = await api.post(`/wearables/sync/${provider}`);
    return response.data;
  },
  
  getWearableData: async (userId, options = {}) => {
    const { days = 7 } = options;
    const response = await api.get(`/wearables/user/${userId}`, { params: { days } });
    return response.data;
  }
};

// WORKOUT SERVICES
export const workoutService = {
  getWorkouts: async (clientId, params = {}) => {
    const response = await api.get(`/workouts/client/${clientId}`, { params });
    return response.data;
  },
  
  getWorkout: async (workoutId) => {
    const response = await api.get(`/workouts/${workoutId}`);
    return response.data;
  },
  
  createWorkout: async (data) => {
    const response = await api.post('/workouts', data);
    return response.data;
  },
  
  logSet: async (workoutId, setData) => {
    const response = await api.post(`/workouts/${workoutId}/set`, setData);
    return response.data;
  },
  
  completeWorkout: async (workoutId, data) => {
    const response = await api.post(`/workouts/${workoutId}/complete`, data);
    return response.data;
  }
};

// GOAL SERVICES
export const goalService = {
  getGoals: async (clientId) => {
    const response = await api.get(`/goals/client/${clientId}`);
    return response.data;
  },
  
  getGoal: async (goalId) => {
    const response = await api.get(`/goals/${goalId}`);
    return response.data;
  },
  
  createGoal: async (data) => {
    const response = await api.post('/goals', data);
    return response.data;
  },
  
  updateGoal: async (goalId, data) => {
    const response = await api.put(`/goals/${goalId}`, data);
    return response.data;
  },
  
  updateProgress: async (goalId, progress) => {
    const response = await api.post(`/goals/${goalId}/progress`, { progress });
    return response.data;
  }
};

// CALENDAR SERVICES
export const calendarService = {
  getEvents: async (userId, params = {}) => {
    const response = await api.get(`/earth/${userId}/calendar/events`, { params });
    return response.data;
  },
  
  createEvent: async (userId, data) => {
    const response = await api.post(`/earth/${userId}/calendar/events`, data);
    return response.data;
  }
};

// COMPANION SERVICES
export const companionService = {
  chat: async (message, userId) => {
    const response = await api.post('/companion/chat', { message, userId });
    return response.data;
  }
};

export default api;
