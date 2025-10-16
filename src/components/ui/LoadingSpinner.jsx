import React from 'react';

export default function LoadingSpinner({ size = 48, color = '#06b6d4', text }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '16px',
      padding: '32px'
    }}>
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        border: `4px solid ${color}22`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      {text && (
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
          {text}
        </p>
      )}
    </div>
  );
}

export function PulsingOrb({ size = 64, color = '#06b6d4' }) {
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
      boxShadow: `0 0 ${size}px ${color}66`,
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    }} />
  );
}

export function SkeletonLoader({ width = '100%', height = '20px', style = {} }) {
  return (
    <div style={{
      width,
      height,
      background: 'linear-gradient(90deg, rgba(148,163,184,0.1) 0%, rgba(148,163,184,0.2) 50%, rgba(148,163,184,0.1) 100%)',
      backgroundSize: '200% 100%',
      borderRadius: '4px',
      animation: 'shimmer 1.5s infinite',
      ...style
    }} />
  );
}