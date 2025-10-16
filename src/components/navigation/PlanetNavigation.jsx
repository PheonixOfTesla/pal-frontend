// src/components/navigation/PlanetNavigation.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, Activity, Dumbbell, Target, Calendar, DollarSign, Clock, Home } from 'lucide-react';

const planets = [
  { name: 'Home', path: '/jarvis', icon: Home, color: '#ffffff' },
  { name: 'Mercury', path: '/mercury', icon: Activity, color: '#94a3b8' },
  { name: 'Venus', path: '/venus', icon: Dumbbell, color: '#f97316' },
  { name: 'Mars', path: '/mars', icon: Target, color: '#ef4444' },
  { name: 'Earth', path: '/earth', icon: Calendar, color: '#10b981' },
  { name: 'Jupiter', path: '/jupiter', icon: DollarSign, color: '#f59e0b' },
  { name: 'Saturn', path: '/saturn', icon: Clock, color: '#a855f7' }
];

export default function PlanetNavigation({ orientation = 'horizontal' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isHorizontal = orientation === 'horizontal';

  return (
    <div style={{
      display: 'flex',
      flexDirection: isHorizontal ? 'row' : 'column',
      gap: isHorizontal ? '8px' : '12px',
      padding: isHorizontal ? '16px' : '20px',
      background: 'rgba(15,23,42,0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      border: '1px solid rgba(148,163,184,0.1)'
    }}>
      {planets.map((planet) => {
        const Icon = planet.icon;
        const isActive = location.pathname === planet.path;

        return (
          <button
            key={planet.name}
            onClick={() => navigate(planet.path)}
            style={{
              background: isActive 
                ? `${planet.color}20`
                : 'transparent',
              border: isActive
                ? `1px solid ${planet.color}40`
                : '1px solid transparent',
              borderRadius: '12px',
              padding: isHorizontal ? '12px 20px' : '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(148,163,184,0.05)';
                e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
              }
            }}
          >
            {/* Active indicator glow */}
            {isActive && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(circle at center, ${planet.color}20 0%, transparent 70%)`,
                pointerEvents: 'none'
              }} />
            )}

            {/* Icon */}
            <Icon 
              size={20} 
              color={isActive ? planet.color : '#64748b'}
              style={{
                filter: isActive ? `drop-shadow(0 0 8px ${planet.color}80)` : 'none',
                transition: 'all 0.2s ease',
                position: 'relative',
                zIndex: 1
              }}
            />

            {/* Label */}
            {isHorizontal && (
              <span style={{
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? planet.color : '#94a3b8',
                transition: 'all 0.2s ease',
                position: 'relative',
                zIndex: 1
              }}>
                {planet.name}
              </span>
            )}

            {/* Tooltip for vertical mode */}
            {!isHorizontal && (
              <div style={{
                position: 'absolute',
                left: '100%',
                marginLeft: '12px',
                background: '#1e293b',
                border: '1px solid rgba(148,163,184,0.2)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#fff',
                whiteSpace: 'nowrap',
                opacity: 0,
                pointerEvents: 'none',
                transition: 'opacity 0.2s ease',
                zIndex: 10
              }}
              className="tooltip">
                {planet.name}
              </div>
            )}
          </button>
        );
      })}

      <style>{`
        button:hover .tooltip {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}