// src/components/interventions/InterventionCard.jsx
import React from 'react';
import { AlertTriangle, Flame, Info, CheckCircle, X } from 'lucide-react';

export default function InterventionCard({ intervention, onAcknowledge, onDismiss }) {
  const getSeverityConfig = () => {
    switch(intervention.severity) {
      case 'critical':
        return { 
          color: '#ef4444', 
          icon: <AlertTriangle size={24} />, 
          bg: 'rgba(239,68,68,0.1)',
          border: 'rgba(239,68,68,0.3)'
        };
      case 'high':
        return { 
          color: '#f97316', 
          icon: <Flame size={24} />, 
          bg: 'rgba(249,115,22,0.1)',
          border: 'rgba(249,115,22,0.3)'
        };
      case 'medium':
        return { 
          color: '#f59e0b', 
          icon: <Info size={24} />, 
          bg: 'rgba(245,158,11,0.1)',
          border: 'rgba(245,158,11,0.3)'
        };
      default:
        return { 
          color: '#06b6d4', 
          icon: <CheckCircle size={24} />, 
          bg: 'rgba(6,182,212,0.1)',
          border: 'rgba(6,182,212,0.3)'
        };
    }
  };

  const config = getSeverityConfig();

  return (
    <div style={{
      background: config.bg,
      border: `1px solid ${config.border}`,
      borderRadius: '12px',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Close button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={16} />
        </button>
      )}

      {/* Header */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        alignItems: 'flex-start',
        marginBottom: '16px' 
      }}>
        <div style={{ color: config.color, flexShrink: 0 }}>
          {config.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            color: '#fff',
            marginBottom: '4px' 
          }}>
            {intervention.title}
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: '#94a3b8',
            lineHeight: '1.6' 
          }}>
            {intervention.message}
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: intervention.actions ? '16px' : 0
      }}>
        <div style={{ 
          fontSize: '12px', 
          color: '#64748b' 
        }}>
          {new Date(intervention.timestamp).toLocaleString()}
        </div>
        <div style={{
          fontSize: '11px',
          padding: '4px 12px',
          borderRadius: '12px',
          background: config.bg,
          border: `1px solid ${config.border}`,
          color: config.color,
          fontWeight: 600,
          textTransform: 'uppercase'
        }}>
          {intervention.severity}
        </div>
      </div>

      {/* Actions */}
      {intervention.actions && intervention.actions.length > 0 && (
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          flexWrap: 'wrap' 
        }}>
          {intervention.actions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => onAcknowledge && onAcknowledge(action)}
              style={{
                background: action.primary 
                  ? `linear-gradient(135deg, ${config.color} 0%, ${config.color}dd 100%)`
                  : 'rgba(148,163,184,0.1)',
                color: action.primary ? '#fff' : '#94a3b8',
                border: action.primary ? 'none' : '1px solid rgba(148,163,184,0.2)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = action.primary 
                  ? `0 4px 12px ${config
? `0 4px 12px ${config.color}40`
                  : '0 4px 12px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}