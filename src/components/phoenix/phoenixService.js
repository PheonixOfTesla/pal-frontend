// src/services/phoenixService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const phoenixService = {
  // Send chat message
  async sendMessage(message, userId) {
    const response = await api.post('/api/ai/chat', {
      message,
      userId,
      timestamp: new Date().toISOString()
    });
    return response.data;
  },

  // Get recovery status
  async getRecoveryStatus(userId) {
    const response = await api.get(`/api/health/recovery/${userId}`);
    return response.data;
  },

  // Get today's schedule
  async getTodaySchedule(userId) {
    const response = await api.get(`/api/calendar/schedule/${userId}`, {
      params: { date: new Date().toISOString().split('T')[0] }
    });
    return response.data;
  },

  // Get workout readiness
  async getWorkoutReadiness(userId) {
    const response = await api.get(`/api/health/workout-readiness/${userId}`);
    return response.data;
  },

  // Get sleep analysis
  async getSleepAnalysis(userId) {
    const response = await api.get(`/api/health/sleep/${userId}`);
    return response.data;
  },

  // Format results for overlay display
  formatResultsData(data, type) {
    switch (type) {
      case 'recovery':
        return [
          {
            title: 'Recovery Score',
            value: `${data.score || 0}/100`,
            description: data.description || 'Recovery status based on HRV and heart rate data.'
          },
          {
            title: 'Resting Heart Rate',
            value: `${data.restingHR || 0} BPM`,
            description: data.hrDescription || 'Current resting heart rate compared to baseline.'
          },
          {
            title: 'Sleep Quality',
            value: `${data.sleepQuality || 0}%`,
            description: data.sleepDescription || 'Sleep efficiency and recovery metrics.'
          }
        ];

      case 'schedule':
        return [
          {
            title: 'Next Event',
            value: data.nextEvent?.time || 'No events',
            description: data.nextEvent?.description || 'No upcoming events scheduled.'
          },
          {
            title: 'Training Window',
            value: data.trainingWindow?.time || 'Flexible',
            description: data.trainingWindow?.description || 'Optimal time for training today.'
          },
          {
            title: 'Free Time',
            value: data.freeTime || '0 Hours',
            description: data.freeTimeDescription || 'Total unscheduled time available.'
          }
        ];

      case 'workout':
        return [
          {
            title: 'Training Readiness',
            value: `${data.readiness || 0}%`,
            description: data.readinessDescription || 'Overall readiness for training.'
          },
          {
            title: 'Recommended Focus',
            value: data.focus || 'Active Recovery',
            description: data.focusDescription || 'Recommended training focus for today.'
          },
          {
            title: 'Volume Capacity',
            value: data.volumeCapacity || 'Moderate',
            description: data.volumeDescription || 'Training volume capacity based on recovery.'
          }
        ];

      case 'sleep':
        return [
          {
            title: 'Total Sleep',
            value: data.totalSleep || '0h 0m',
            description: data.totalSleepDescription || 'Total sleep duration last night.'
          },
          {
            title: 'Deep Sleep',
            value: data.deepSleep || '0h 0m',
            description: data.deepSleepDescription || 'Deep sleep duration and quality.'
          },
          {
            title: 'Sleep Efficiency',
            value: `${data.efficiency || 0}%`,
            description: data.efficiencyDescription || 'Sleep efficiency rating.'
          }
        ];

      default:
        return [];
    }
  }
};

export default phoenixService;