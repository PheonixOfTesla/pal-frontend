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

// ═══════════════════════════════════════════════════════════════════
// AUTH SERVICES
// ═══════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════
// INTELLIGENCE SERVICES (Mercury)
// ═══════════════════════════════════════════════════════════════════
export const intelligenceService = {
  getHealthMetrics: async (userId) => {
    const response = await api.get(`/intelligence/${userId}`);
    return response.data;
  },
  
  getInsights: async (userId) => {
    const response = await api.get(`/intelligence/${userId}/insights`);
    return response.data;
  },
  
  getPredictions: async (userId) => {
    const response = await api.get(`/intelligence/${userId}/predictions`);
    return response.data;
  },
  
  getInterventions: async (userId) => {
    const response = await api.get(`/intelligence/${userId}/interventions`);
    return response.data;
  },
  
  acknowledgeIntervention: async (userId, interventionId) => {
    const response = await api.post(
      `/intelligence/${userId}/interventions/${interventionId}/acknowledge`
    );
    return response.data;
  }
};

// ═══════════════════════════════════════════════════════════════════
// COMPANION SERVICES (Phoenix AI)
// ═══════════════════════════════════════════════════════════════════
export const companionService = {
  // Main chat interface
  chat: async (userId, message, context = {}) => {
    const response = await api.post('/companion/chat', { 
      message, 
      userId,
      context 
    });
    return response.data;
  },
  
  // Get Phoenix's current state (personality, mood, urgency)
  getCompanionState: async (userId) => {
    const response = await api.get(`/companion/${userId}/state`);
    return response.data;
  },
  
  // Get conversation history
  getConversationHistory: async (userId, limit = 50) => {
    const response = await api.get(`/companion/${userId}/history`, {
      params: { limit }
    });
    return response.data;
  },
  
  // Clear conversation history
  clearHistory: async (userId) => {
    const response = await api.delete(`/companion/${userId}/history`);
    return response.data;
  },
  
  // Voice chat sessions
  startVoiceSession: async (userId) => {
    const response = await api.post(`/companion/${userId}/voice/start`);
    return response.data;
  },
  
  endVoiceSession: async (userId, sessionId) => {
    const response = await api.post(`/companion/${userId}/voice/end`, {
      sessionId
    });
    return response.data;
  },
  
  // Quick actions (shortcuts for common requests)
  quickAction: async (userId, actionType, params = {}) => {
    const response = await api.post(`/companion/${userId}/quick-action`, {
      actionType,
      params
    });
    return response.data;
  }
};

// ═══════════════════════════════════════════════════════════════════
// WEARABLE SERVICES (Venus)
// ═══════════════════════════════════════════════════════════════════
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
  },
  
  disconnectDevice: async (provider) => {
    const response = await api.delete(`/wearables/disconnect/${provider}`);
    return response.data;
  }
};

// ═══════════════════════════════════════════════════════════════════
// WORKOUT SERVICES (Mars)
// ═══════════════════════════════════════════════════════════════════
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
  },
  
  deleteWorkout: async (workoutId) => {
    const response = await api.delete(`/workouts/${workoutId}`);
    return response.data;
  }
};

// ═══════════════════════════════════════════════════════════════════
// GOAL SERVICES (Mars)
// ═══════════════════════════════════════════════════════════════════
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
  },
  
  deleteGoal: async (goalId) => {
    const response = await api.delete(`/goals/${goalId}`);
    return response.data;
  }
};

// ═══════════════════════════════════════════════════════════════════
// NUTRITION SERVICES (Jupiter)
// ═══════════════════════════════════════════════════════════════════
export const nutritionService = {
  logMeal: async (userId, mealData) => {
    const response = await api.post(`/nutrition/${userId}/meals`, mealData);
    return response.data;
  },
  
  getMeals: async (userId, params = {}) => {
    const response = await api.get(`/nutrition/${userId}/meals`, { params });
    return response.data;
  },
  
  getNutritionSummary: async (userId, date) => {
    const response = await api.get(`/nutrition/${userId}/summary`, {
      params: { date }
    });
    return response.data;
  },
  
  searchFoods: async (query) => {
    const response = await api.get('/nutrition/foods/search', {
      params: { query }
    });
    return response.data;
  }
};

// ═══════════════════════════════════════════════════════════════════
// CALENDAR SERVICES (Earth)
// ═══════════════════════════════════════════════════════════════════
export const calendarService = {
  getEvents: async (userId, params = {}) => {
    const response = await api.get(`/earth/${userId}/calendar/events`, { params });
    return response.data;
  },
  
  createEvent: async (userId, data) => {
    const response = await api.post(`/earth/${userId}/calendar/events`, data);
    return response.data;
  },
  
  updateEvent: async (userId, eventId, data) => {
    const response = await api.put(`/earth/${userId}/calendar/events/${eventId}`, data);
    return response.data;
  },
  
  deleteEvent: async (userId, eventId) => {
    const response = await api.delete(`/earth/${userId}/calendar/events/${eventId}`);
    return response.data;
  }
};

// ═══════════════════════════════════════════════════════════════════
// MEASUREMENT SERVICES (Body tracking)
// ═══════════════════════════════════════════════════════════════════
export const measurementService = {
  logMeasurement: async (userId, measurementData) => {
    const response = await api.post(`/measurements/${userId}`, measurementData);
    return response.data;
  },
  
  getMeasurements: async (userId, params = {}) => {
    const response = await api.get(`/measurements/${userId}`, { params });
    return response.data;
  },
  
  getProgress: async (userId, metric, timeRange) => {
    const response = await api.get(`/measurements/${userId}/progress`, {
      params: { metric, timeRange }
    });
    return response.data;
  }
};

// ═══════════════════════════════════════════════════════════════════
// INTERVENTION SERVICES (Proactive AI)
// ═══════════════════════════════════════════════════════════════════
export const interventionService = {
  getPending: async (userId) => {
    const response = await api.get(`/interventions/${userId}/pending`);
    return response.data;
  },
  
  acknowledge: async (userId, interventionId, response) => {
    const res = await api.post(
      `/interventions/${userId}/${interventionId}/acknowledge`,
      { response }
    );
    return res.data;
  },
  
  dismiss: async (userId, interventionId) => {
    const response = await api.post(
      `/interventions/${userId}/${interventionId}/dismiss`
    );
    return response.data;
  }
};

// ═══════════════════════════════════════════════════════════════════
// SATURN SERVICES (Legacy/Long-term planning)
// ═══════════════════════════════════════════════════════════════════
export const saturnService = {
  getVision: async (userId) => {
    const response = await api.get(`/saturn/${userId}/vision`);
    return response.data;
  },
  
  updateVision: async (userId, visionData) => {
    const response = await api.put(`/saturn/${userId}/vision`, visionData);
    return response.data;
  },
  
  getQuarterlyReview: async (userId, quarter, year) => {
    const response = await api.get(`/saturn/${userId}/reviews/${year}/${quarter}`);
    return response.data;
  }
};

export default api;
