import React from 'react';

export default function Card({ 
  children, 
  className = '', 
  hover = false,
  glow = false,
  glowColor = '#06b6d4',
  onClick,
  style = {}
}) {
  const baseStyle = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(148,163,184,0.1)',
    borderRadius: '12px',
    padding: '20px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    overflow: 'hidden',
    ...style
  };

  const hoverStyle = hover ? {
    ':hover': {
      background: 'rgba(255,255,255,0.04)',
      borderColor: 'rgba(148,163,184,0.3)',
      transform: 'translateY(-2px)',
      boxShadow: glow ? `0 8px 24px ${glowColor}33` : '0 8px 24px rgba(0,0,0,0.3)'
    }
  } : {};

  return (
    <div 
      className={`card ${className}`}
      style={baseStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          if (glow) {
            e.currentTarget.style.boxShadow = `0 8px 24px ${glowColor}33`;
          }
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
          e.currentTarget.style.borderColor = 'rgba(148,163,184,0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {children}
    </div>
  );
}

export function GlassCard({ children, className = '', style = {} }) {
  return (
    <div
      className={`glass-card ${className}`}
      style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '24px',
        ...style
      }}
    >
      {children}
    </div>
  );
}

export function MetricCard({ 
  icon, 
  title, 
  value, 
  unit, 
  trend, 
  color = '#06b6d4',
  description,
  onClick 
}) {
  const getTrendIcon = () => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  const getTrendColor = () => {
    if (trend === 'up') return '#10b981';
    if (trend === 'down') return '#ef4444';
    return '#94a3b8';
  };

  return (
    <Card hover glow glowColor={color} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon}
          <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500 }}>{title}</span>
        </div>
        {trend && (
          <span style={{ 
            fontSize: '18px', 
            color: getTrendColor(),
            fontWeight: 'bold'
          }}>
            {getTrendIcon()}
          </span>
        )}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <span style={{ 
          fontSize: '36px', 
          fontWeight: 'bold', 
          color, 
          lineHeight: 1,
          textShadow: `0 0 20px ${color}44`
        }}>
          {value}
        </span>
        <span style={{ fontSize: '18px', color: '#64748b', marginLeft: '4px' }}>
          {unit}
        </span>
      </div>
      
      {description && (
        <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.4, margin: 0 }}>
          {description}
        </p>
      )}
    </Card>
  );
}