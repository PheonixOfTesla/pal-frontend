import { create } from 'zustand';

export const useDataStore = create((set) => ({
  // Wearable Data
  wearableData: null,
  loading: false,
  error: null,
  
  setWearableData: (data) => set({ wearableData: data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  // Intelligence Data
  intelligenceData: null,
  setIntelligenceData: (data) => set({ intelligenceData: data }),
  
  // Workouts
  workouts: [],
  setWorkouts: (workouts) => set({ workouts }),
  
  // Goals
  goals: [],
  setGoals: (goals) => set({ goals }),
  
  // Clear all data
  clearData: () => set({
    wearableData: null,
    intelligenceData: null,
    workouts: [],
    goals: [],
    error: null,
  }),
}));