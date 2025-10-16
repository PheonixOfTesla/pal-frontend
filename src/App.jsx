import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PalPage from './pages/PalPage';
import JarvisPage from './pages/JarvisPage';
import MercuryPage from './pages/MercuryPage';
import VenusPage from './pages/VenusPage';
import EarthPage from './pages/EarthPage';  // ADD THIS
import MarsPage from './pages/MarsPage';    // ADD THIS

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = useAuthStore(state => state.token);
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <PalPage />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
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
        
        {/* ADD THESE TWO ROUTES */}
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
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
