// src/components/voice/PhoenixAvatar.jsx
import React from 'react';
import { Flame } from 'lucide-react';

export default function PhoenixAvatar({ state = 'idle' }) {
  // state: 'idle' | 'listening' | 'thinking' | 'speaking' | 'alert'
  
  const getStateConfig = () => {
    switch (state) {
      case 'listening':
        return {
          color: '#f59e0b',
          glow: 'rgba(245,158,11,0.8)',
          animation: 'pulse 1s infinite',
          message: 'Listening...'
        };
      case 'thinking':
        return {
          color: '#8b5cf6',
          glow: 'rgba(139,92,246,0.8)',
          animation: 'spin 2s linear infinite',
          message: 'Processing...'
        };
      case 'speaking':
        return {
          color: '#10b981',
          glow: 'rgba(16,185,129,0.8)',
          animation: 'pulse 0.5s infinite',
          message: 'Phoenix speaking...'
        };
      case 'alert':
        return {
          color: '#ef4444',
          glow: 'rgba(239,68,68,0.9)',
          animation: 'shake 0.5s infinite',
          message: 'Alert!'
        };
      default: // idle
        return {
          color: '#06b6d4',
          glow: 'rgba(6,182,212,0.6)',
          animation: 'float 3s ease-in-out infinite',
          message: 'Ready'
        };
    }
  };

  const config = getStateConfig();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px'
    }}>
      {/* Avatar Container */}
      <div style={{
        position: 'relative',
        width: '200px',
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        
        {/* Outer Glow Ring */}
        <div style={{
          position: 'absolute',
          inset: -20,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
          animation: config.animation,
          pointerEvents: 'none'
        }} />
        
        {/* Middle Ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `2px solid ${config.color}`,
          opacity: 0.5,
          animation: 'ripple 2s ease-out infinite'
        }} />
        
        {/* Inner Avatar Circle */}
        <div style={{
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, ${config.color}, #0f172a)`,
          border: `3px solid ${config.color}`,
          boxShadow: `0 0 60px ${config.glow}, inset 0 0 40px rgba(0,0,0,0.5)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          
          {/* Flame Icon */}
          <Flame 
            size={80} 
            color={config.color}
            style={{
              filter: `drop-shadow(0 0 20px ${config.glow})`,
              animation: state === 'speaking' ? 'flicker 0.3s infinite' : 'none'
            }}
          />
          
          {/* Animated Particles */}
          {(state === 'listening' || state === 'speaking') && (
            <>
              <div style={{
                position: 'absolute',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: config.color,
                animation: 'particle1 2s ease-in-out infinite',
                boxShadow: `0 0 10px ${config.glow}`
              }} />
              <div style={{
                position: 'absolute',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: config.color,
                animation: 'particle2 2.5s ease-in-out infinite 0.5s',
                boxShadow: `0 0 10px ${config.glow}`
              }} />
              <div style={{
                position: 'absolute',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: config.color,
                animation: 'particle3 2s ease-in-out infinite 1s',
                boxShadow: `0 0 10px ${config.glow}`
              }} />
            </>
          )}
        </div>
      </div>

      {/* Status Text */}
      <div style={{
        fontSize: '18px',
        fontWeight: 600,
        color: config.color,
        textShadow: `0 0 20px ${config.glow}`,
        letterSpacing: '1px'
      }}>
        {config.message}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.3); opacity: 0; }
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        @keyframes particle1 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-40px, -60px) scale(0); opacity: 0; }
        }

        @keyframes particle2 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(40px, -60px) scale(0); opacity: 0; }
        }

        @keyframes particle3 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(0, -70px) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
