// src/App.jsx - SINGLE PAGE APP WITH VOICE-DRIVEN OVERLAYS
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import wsManager from './services/websocket';

// Pages
import LoginPage from './pages/LoginPage';
import PalPage from './pages/PalPage';
import JarvisPage from './pages/JarvisPage';

// Global Components
import ProactiveAlert from './components/notifications/ProactiveAlert';

function ProtectedRoute({ children }) {
  const token = useAuthStore(state => state.token);
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const [proactiveAlert, setProactiveAlert] = useState(null);

  // Initialize WebSocket when user logs in
  useEffect(() => {
    if (user?._id && token) {
      console.log('🔌 Initializing WebSocket for user:', user._id);
      wsManager.connect(user._id, token);

      // Listen for proactive interventions
      const unsubscribe = wsManager.on('intervention', (data) => {
        console.log('🚨 Proactive intervention received:', data);
        
        // Speak the alert
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(
            `Alert: ${data.message}`
          );
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          speechSynthesis.speak(utterance);
        }
        
        setProactiveAlert(data);
      });

      return () => {
        unsubscribe();
        wsManager.disconnect();
      };
    }
  }, [user, token]);

  return (
    <Router>
      {/* Proactive Alert Overlay */}
      {proactiveAlert && (
        <ProactiveAlert
          alert={proactiveAlert}
          onAcknowledge={() => {
            // Send acknowledgment to backend
            wsManager.send({
              type: 'intervention_acknowledged',
              interventionId: proactiveAlert.interventionId
            });
            setProactiveAlert(null);
          }}
          onDismiss={() => setProactiveAlert(null)}
        />
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <PalPage />
          </ProtectedRoute>
        } />
        
        <Route path="/jarvis" element={
          <ProtectedRoute>
            <JarvisPage />
          </ProtectedRoute>
        } />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
