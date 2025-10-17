// src/components/predictions/PredictionCard.jsx - Forecast Visualizations
import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

export default function PredictionCard({ prediction }) {
  const {
    type,
    metric,
    currentValue,
    predictedValue,
    confidence,
    trend,
    risk,
    recommendation,
    timeframe
  } = prediction;

  const getTrendIcon = () => {
    if (trend === 'improving') return <TrendingUp size={24} color="#10b981" />;
    if (trend === 'declining') return <TrendingDown size={24} color="#ef4444" />;
    return <AlertTriangle size={24} color="#f59e0b" />;
  };

  const getRiskColor = () => {
    if (risk === 'low') return '#10b981';
    if (risk === 'medium') return '#f59e0b';
    return '#ef4444';
  };

  const getRiskLabel = () => {
    if (risk === 'low') return 'Low Risk';
    if (risk === 'medium') return 'Moderate Risk';
    return 'High Risk';
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.05) 100%)',
      border: '1px solid rgba(99,102,241,0.3)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 0 30px rgba(99,102,241,0.2)',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {getTrendIcon()}
          <div>
            <h3 style={{ color: '#6366f1', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
              {metric} Forecast
            </h3>
            <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>
              {timeframe}
            </p>
          </div>
        </div>

        {/* Confidence Badge */}
        <div style={{
          padding: '6px 12px',
          background: 'rgba(99,102,241,0.2)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '12px',
          fontSize: '12px',
          color: '#6366f1',
          fontWeight: 600
        }}>
          {confidence}% Confidence
        </div>
      </div>

      {/* Values Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div style={{
          background: 'rgba(148,163,184,0.05)',
          border: '1px solid rgba(148,163,184,0.2)',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>
            CURRENT
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#94a3b8' }}>
            {currentValue}
          </div>
        </div>

        <div style={{
          background: 'rgba(99,102,241,0.1)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', color: '#6366f1', marginBottom: '8px', fontWeight: 600 }}>
            PREDICTED
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#6366f1' }}>
            {predictedValue}
          </div>
        </div>
      </div>

      {/* Risk Level */}
      <div style={{
        background: `rgba(${risk === 'low' ? '16,185,129' : risk === 'medium' ? '245,158,11' : '239,68,68'},0.1)`,
        border: `1px solid ${getRiskColor()}33`,
        borderRadius: '12px',
        padding: '12px 16px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        {risk === 'low' ? (
          <CheckCircle size={20} color={getRiskColor()} />
        ) : (
          <AlertTriangle size={20} color={getRiskColor()} />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: getRiskColor(), marginBottom: '2px' }}>
            {getRiskLabel()}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Based on your current patterns
          </div>
        </div>
      </div>

      {/* Recommendation */}
      {recommendation && (
        <div style={{
          background: 'rgba(6,182,212,0.05)',
          border: '1px solid rgba(6,182,212,0.2)',
          borderRadius: '12px',
          padding: '16px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#06b6d4', marginBottom: '8px' }}>
            💡 RECOMMENDATION
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
            {recommendation}
          </p>
        </div>
      )}

      {/* Visualization */}
      <div style={{ marginTop: '20px', height: '60px', position: 'relative' }}>
        <svg width="100%" height="60" viewBox="0 0 300 60" style={{ overflow: 'visible' }}>
          {/* Grid lines */}
          <line x1="0" y1="30" x2="300" y2="30" stroke="rgba(148,163,184,0.2)" strokeWidth="1" />
          
          {/* Trend line */}
          <path
            d={trend === 'improving' 
              ? 'M 0,50 Q 75,45 150,25 T 300,10'
              : trend === 'declining'
              ? 'M 0,10 Q 75,15 150,35 T 300,50'
              : 'M 0,30 Q 75,25 150,30 T 300,30'
            }
            stroke="#6366f1"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Gradient fill */}
          <defs>
            <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(99,102,241,0.3)" />
              <stop offset="100%" stopColor="rgba(99,102,241,0)" />
            </linearGradient>
          </defs>
          <path
            d={trend === 'improving' 
              ? 'M 0,50 Q 75,45 150,25 T 300,10 L 300,60 L 0,60 Z'
              : trend === 'declining'
              ? 'M 0,10 Q 75,15 150,35 T 300,50 L 300,60 L 0,60 Z'
              : 'M 0,30 Q 75,25 150,30 T 300,30 L 300,60 L 0,60 Z'
            }
            fill="url(#trendGradient)"
          />
        </svg>
      </div>
    </div>
  );
}