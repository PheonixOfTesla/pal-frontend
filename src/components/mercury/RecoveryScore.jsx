import React from 'react';
import { Zap, TrendingUp, TrendingDown } from 'lucide-react';

export default function RecoveryScore({ score, trend, components, recommendation }) {
  const getScoreColor = (score) => {
    if (score >= 70) return '#10b981';
    if (score >= 50) return '#f59e0b';
    if (score >= 30) return '#f97316';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return 'Optimal';
    if (score >= 50) return 'Good';
    if (score >= 30) return 'Low';
    return 'Critical';
  };

  const color = getScoreColor(score);

  return (
    <div style={{
      background: `${color}11`,
      border: `1px solid ${color}33`,
      borderRadius: '16px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '200px',
        height: '200px',
        background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '24px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Zap size={28} color={color} />
          <div>
            <h3 style={{ 
              color: color, 
              fontSize: '18px', 
              fontWeight: 700,
              margin: 0,
              marginBottom: '4px'
            }}>
              Recovery Score
            </h3>
            <span style={{ color: '#64748b', fontSize: '13px' }}>
              {getScoreLabel(score)} Training Readiness
            </span>
          </div>
        </div>
        {trend && (
          trend === 'up' ? 
            <TrendingUp size={24} color="#10b981" /> : 
            <TrendingDown size={24} color="#ef4444" />
        )}
      </div>

      {/* Score Display */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'baseline', 
        gap: '8px',
        marginBottom: '24px',
        position: 'relative',
        zIndex: 1
      }}>
        <span style={{ 
          fontSize: '72px', 
          fontWeight: 'bold', 
          color,
          lineHeight: 1,
          textShadow: `0 0 30px ${color}66`
        }}>
          {score}
        </span>
        <span style={{ fontSize: '24px', color: '#64748b' }}>/ 100</span>
      </div>

      {/* Progress Bar */}
      <div style={{
        height: '8px',
        background: 'rgba(148,163,184,0.1)',
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          height: '100%',
          width: `${score}%`,
          background: `linear-gradient(90deg, ${color} 0%, ${color}CC 100%)`,
          borderRadius: '4px',
          transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: `0 0 12px ${color}88`
        }} />
      </div>

      {/* Components Breakdown */}
      {components && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '20px',
          position: 'relative',
          zIndex: 1
        }}>
          {Object.entries(components).map(([key, data]) => (
            <div key={key} style={{
              background: 'rgba(255,255,255,0.02)',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(148,163,184,0.1)'
            }}>
              <div style={{ 
                fontSize: '11px', 
                color: '#94a3b8',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color }}>
                  {data.value}
                </span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  ({data.weight}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendation */}
      {recommendation && (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid rgba(148,163,184,0.1)',
          position: 'relative',
          zIndex: 1
        }}>
          <p style={{ 
            fontSize: '14px', 
            color: '#94a3b8', 
            margin: 0,
            lineHeight: 1.6
          }}>
            💡 <strong style={{ color }}>Recommendation:</strong> {recommendation}
          </p>
        </div>
      )}
    </div>
  );
}