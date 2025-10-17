// src/context/JarvisContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useWebVoiceChat } from '../hooks/useWebVoiceChat';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';

const JarvisContext = createContext();

export function JarvisProvider({ children }) {
  const user = useAuthStore(state => state.user);
  const { intelligenceData } = useDataStore();
  
  const [isVisible, setIsVisible] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentContext, setCurrentContext] = useState({
    page: 'dashboard',
    data: null,
    lastCommand: null
  });

  // Conditionally initialize voice
  const voiceEnabled = isActive && process.env.REACT_APP_ENABLE_VOICE_CHAT === 'true';
  const voiceChat = voiceEnabled ? useWebVoiceChat() : null;

  // JARVIS actions
  const activateJarvis = useCallback(() => setIsActive(true), []);
  const deactivateJarvis = useCallback(() => setIsActive(false), []);
  const toggleJarvis = useCallback(() => setIsActive(prev => !prev), []);
  
  const updateContext = useCallback((page, data) => {
    setCurrentContext({ page, data, lastCommand: null });
  }, []);

  const executeCommand = useCallback((command) => {
    setCurrentContext(prev => ({ ...prev, lastCommand: command }));
    // Command routing logic here
  }, []);

  const value = {
    // State
    isVisible,
    isActive,
    isListening,
    currentContext,
    
    // Voice system
    voiceChat: voiceChat || { isConnected: false, phoenixState: 'idle' },
    
    // Actions
    activateJarvis,
    deactivateJarvis,
    toggleJarvis,
    updateContext,
    executeCommand,
    setIsListening,
    
    // Context data
    user,
    intelligenceData
  };

  return <JarvisContext.Provider value={value}>{children}</JarvisContext.Provider>;
}

export const useJarvis = () => {
  const context = useContext(JarvisContext);
  if (!context) throw new Error('useJarvis must be used within JarvisProvider');
  return context;
};