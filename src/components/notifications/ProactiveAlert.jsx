// src/components/notifications/ProactiveAlert.jsx
import React, { useEffect } from 'react';
import { AlertTriangle, Flame, X, CheckCircle } from 'lucide-react';

export default function ProactiveAlert({ alert, onAcknowledge, onDismiss }) {
  useEffect(() => {
    // Prevent body scroll when alert is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const getSeverityConfig = () => {
    switch(alert.severity) {
      case 'critical':
        return { color: '#ef4444', icon: <AlertTriangle size={48} />, glow: 'rgba(239,68,68,0.8)' };
      case 'high':
        return { color: '#f97316', icon: <Flame size={48} />, glow: 'rgba(249,115,22,0.8)' };
      case 'medium':
        return { color: '#f59e0b', icon: <AlertTriangle size={48} />, glow: 'rgba(245,158,11,0.8)' };
      default:
        return { color: '#06b6d4', icon: <CheckCircle size={48} />, glow: 'rgba(6,182,212,0.8)' };
    }
  };

  const config = getSeverityConfig();

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(0,0,0,0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      backdropFilter: 'blur(10px)',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        background: `linear-gradient(135deg, ${config.color}22 0%, ${config.color}11 100%)`,
        border: `2px solid ${config.color}`,
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: `0 0 80px ${config.glow}`,
        animation: 'slideUp 0.4s ease-out',
        position: 'relative'
      }}>
        
        {/* Close button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              color: config.color,
              cursor: 'pointer',
              opacity: 0.6,
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = 1}
            onMouseLeave={(e) => e.target.style.opacity = 0.6}
          >
            <X size={24} />
          </button>
        )}

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
          <div style={{ color: config.color, animation: 'pulse 2s infinite' }}>
            {config.icon}
          </div>
          <div>
            <h2 style={{ 
              color: config.color, 
              fontSize: '28px', 
              fontWeight: 'bold', 
              marginBottom: '8px',
              textShadow: `0 0 20px ${config.glow}`
            }}>
              Phoenix Alert
            </h2>
            <div style={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {alert.type || 'Intervention Required'}
            </div>
          </div>
        </div>

        {/* Message */}
        <div style={{
          background: 'rgba(0,0,0,0.4)',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '24px',
          border: `1px solid ${config.color}33`
        }}>
          <p style={{ 
            color: '#fff', 
            fontSize: '18px', 
            lineHeight: 1.6, 
            margin: 0
          }}>
            {alert.message}
          </p>
        </div>

        {/* Recommendation */}
        {alert.recommendation && (
          <div style={{
            background: `${config.color}15`,
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '32px',
            border: `1px solid ${config.color}40`
          }}>
            <div style={{ 
              color: config.color, 
              fontSize: '12px', 
              fontWeight: 'bold', 
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              💡 Recommendation
            </div>
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', lineHeight: 1.5 }}>
              {alert.recommendation}
            </div>
          </div>
        )}

        {/* Data Context */}
        {alert.data && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {Object.entries(alert.data).map(([key, value]) => (
              <div key={key} style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: config.color }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onClick={onAcknowledge}
            style={{
              flex: 1,
              padding: '16px 32px',
              background: config.color,
              border: 'none',
              borderRadius: '12px',
              color: '#000',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: `0 4px 20px ${config.glow}`,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = `0 6px 30px ${config.glow}`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = `0 4px 20px ${config.glow}`;
            }}
          >
            {alert.action || 'Acknowledge & Continue'}
          </button>

          {onDismiss && (
            <button
              onClick={onDismiss}
              style={{
                padding: '16px 32px',
                background: 'rgba(148,163,184,0.1)',
                border: '1px solid rgba(148,163,184,0.3)',
                borderRadius: '12px',
                color: '#94a3b8',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(148,163,184,0.2)';
                e.target.style.borderColor = 'rgba(148,163,184,0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(148,163,184,0.1)';
                e.target.style.borderColor = 'rgba(148,163,184,0.3)';
              }}
            >
              Dismiss
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}