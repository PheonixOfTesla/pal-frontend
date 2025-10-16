import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  onClick,
  className = '',
  style = {}
}) {
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      color: '#fff',
      border: 'none',
      boxShadow: '0 4px 12px rgba(6,182,212,0.3)',
      ':hover': {
        boxShadow: '0 6px 20px rgba(6,182,212,0.4)',
        transform: 'translateY(-1px)'
      }
    },
    secondary: {
      background: 'rgba(148,163,184,0.1)',
      color: '#94a3b8',
      border: '1px solid rgba(148,163,184,0.3)',
      ':hover': {
        background: 'rgba(148,163,184,0.2)',
        borderColor: 'rgba(148,163,184,0.5)'
      }
    },
    danger: {
      background: 'rgba(239,68,68,0.1)',
      color: '#ef4444',
      border: '1px solid rgba(239,68,68,0.3)',
      ':hover': {
        background: 'rgba(239,68,68,0.2)',
        borderColor: 'rgba(239,68,68,0.5)'
      }
    },
    ghost: {
      background: 'transparent',
      color: '#06b6d4',
      border: 'none',
      ':hover': {
        background: 'rgba(6,182,212,0.1)'
      }
    }
  };

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '14px' },
    md: { padding: '12px 24px', fontSize: '16px' },
    lg: { padding: '16px 32px', fontSize: '18px' }
  };

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: disabled || loading ? 0.5 : 1,
    ...variants[variant],
    ...sizes[size],
    ...style
  };

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      className={`btn btn-${variant} ${className}`}
      style={{
        ...baseStyle,
        ...(isHovered && !disabled && !loading ? variants[variant][':hover'] : {})
      }}
      onClick={disabled || loading ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled || loading}
    >
      {loading ? (
        <div style={{ 
          width: '16px', 
          height: '16px', 
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.6s linear infinite'
        }} />
      ) : icon}
      {children}
    </button>
  );
}