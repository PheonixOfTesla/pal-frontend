// src/App.jsx - WITH WebSocket + Proactive Alerts
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import wsManager from './services/websocket';

// Pages
import LoginPage from './pages/LoginPage';
import PalPage from './pages/PalPage';
import JarvisPage from './pages/JarvisPage';
import MercuryPage from './pages/MercuryPage';
import VenusPage from './pages/VenusPage';
import EarthPage from './pages/EarthPage';
import MarsPage from './pages/MarsPage';
import JupiterPage from './pages/JupiterPage';
import SaturnPage from './pages/SaturnPage';

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
        
        <Route path="/mercury" element={
          <ProtectedRoute>
            <MercuryPage />
          </ProtectedRoute>
        } />
        
        <Route path="/venus" element={
          <ProtectedRoute>
            <VenusPage />
          </ProtectedRoute>
        } />
        
        <Route path="/earth" element={
          <ProtectedRoute>
            <EarthPage />
          </ProtectedRoute>
        } />
        
        <Route path="/mars" element={
          <ProtectedRoute>
            <MarsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/jupiter" element={
          <ProtectedRoute>
            <JupiterPage />
          </ProtectedRoute>
        } />
        
        <Route path="/saturn" element={
          <ProtectedRoute>
            <SaturnPage />
          </ProtectedRoute>
        } />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
