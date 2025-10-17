// src/components/jarvis/FloatingJarvis.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Flame, Mic } from 'lucide-react';
import { useJarvis } from '../../context/JarvisContext';

export default function FloatingJarvis() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isActive, voiceChat, activateJarvis, toggleJarvis } = useJarvis();

  const isOnJarvisPage = location.pathname === '/jarvis';
  const phoenixState = voiceChat?.phoenixState || 'idle';
  const isConnected = voiceChat?.isConnected || false;

  const handleClick = () => {
    if (!isOnJarvisPage) {
      navigate('/jarvis');
    } else {
      toggleJarvis();
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: phoenixState === 'listening' 
          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
          : phoenixState === 'speaking'
          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          : 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        border: 'none',
        boxShadow: '0 8px 24px rgba(6,182,212,0.4)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        zIndex: 9999,
        animation: phoenixState === 'speaking' ? 'pulse 1s infinite' : 'none'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <Flame size={32} color="#fff" style={{ 
        filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.6))'
      }} />
    </button>
  );
}