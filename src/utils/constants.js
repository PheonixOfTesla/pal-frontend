export const PLANET_COLORS = {
  mercury: '#94a3b8', // Silver
  venus: '#f97316',   // Orange
  earth: '#3b82f6',   // Blue
  mars: '#ef4444',    // Red
  jupiter: '#f59e0b', // Amber
  saturn: '#8b5cf6'   // Purple
};

export const PLANET_ROUTES = {
  mercury: '/mercury',
  venus: '/venus',
  earth: '/earth',
  mars: '/mars',
  jupiter: '/jupiter',
  saturn: '/saturn'
};

export const PLANET_NAMES = {
  mercury: '☿️ Mercury',
  venus: '♀️ Venus',
  earth: '🌍 Earth',
  mars: '♂️ Mars',
  jupiter: '♃ Jupiter',
  saturn: '♄ Saturn'
};

export const RECOVERY_LEVELS = {
  CRITICAL: { min: 0, max: 30, label: 'Critical', color: '#ef4444' },
  LOW: { min: 30, max: 50, label: 'Low', color: '#f97316' },
  GOOD: { min: 50, max: 70, label: 'Good', color: '#f59e0b' },
  OPTIMAL: { min: 70, max: 100, label: 'Optimal', color: '#10b981' }
};

export const SLEEP_STAGES = {
  DEEP: { color: '#6366f1', label: 'Deep Sleep' },
  REM: { color: '#8b5cf6', label: 'REM Sleep' },
  LIGHT: { color: '#a78bfa', label: 'Light Sleep' },
  AWAKE: { color: '#94a3b8', label: 'Awake' }
};

export const TRAINING_LOAD_ZONES = {
  DETRAINING: { min: 0, max: 0.8, label: 'Detraining', color: '#94a3b8' },
  MAINTAINING: { min: 0.8, max: 1.0, label: 'Maintaining', color: '#3b82f6' },
  OPTIMAL: { min: 1.0, max: 1.3, label: 'Optimal', color: '#10b981' },
  BUILDING: { min: 1.3, max: 1.5, label: 'Building', color: '#f59e0b' },
  OVERREACHING: { min: 1.5, max: Infinity, label: 'Overreaching', color: '#ef4444' }
};

export const API_ENDPOINTS = {
  AUTH: '/auth',
  INTELLIGENCE: '/intelligence',
  WEARABLES: '/wearables',
  WORKOUTS: '/workouts',
  GOALS: '/goals',
  MEASUREMENTS: '/measurements',
  NUTRITION: '/nutrition',
  INTERVENTIONS: '/interventions',
  PREDICTIONS: '/predictions',
  COMPANION: '/companion',
  SATURN: '/saturn'
};

export const WEARABLE_PROVIDERS = [
  { id: 'whoop', name: 'Whoop', icon: '⌚' },
  { id: 'oura', name: 'Oura Ring', icon: '💍' },
  { id: 'fitbit', name: 'Fitbit', icon: '⌚' },
  { id: 'garmin', name: 'Garmin', icon: '⌚' },
  { id: 'polar', name: 'Polar', icon: '⌚' },
  { id: 'apple_health', name: 'Apple Health', icon: '🍎' }
];

export const TOAST_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 7000
};

export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500
};