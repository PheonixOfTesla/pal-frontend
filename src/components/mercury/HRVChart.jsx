import React from 'react';
import { Activity } from 'lucide-react';

export default function HRVChart({ data, baseline }) {
  if (!data || data.length === 0) {
    return (
      <div style={{
        background: 'rgba(6,182,212,0.05)',
        border: '1px solid rgba(6,182,212,0.2)',
        borderRadius: '12px',
        padding: '24px',
        textAlign: 'center'
      }}>
        <Activity size={48} color="#06b6d4" style={{ opacity: 0.3, margin: '0 auto 16px' }} />
        <p style={{ color: '#64748b', margin: 0 }}>No HRV data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), baseline || 0);
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const getColor = (value) => {
    if (value >= baseline * 1.1) return '#10b981';
    if (value >= baseline * 0.9) return '#06b6d4';
    if (value >= baseline * 0.8) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{
      background: 'rgba(6,182,212,0.05)',
      border: '1px solid rgba(6,182,212,0.2)',
      borderRadius: '16px',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Activity size={28} color="#06b6d4" />
          <div>
            <h3 style={{ color: '#06b6d4', fontSize: '18px', fontWeight: 700, margin: 0 }}>
              HRV Trend
            </h3>
            <span style={{ color: '#64748b', fontSize: '13px' }}>
              7-day average
            </span>
          </div>
        </div>
        {baseline && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
              Baseline
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#06b6d4' }}>
              {baseline} ms
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div style={{ position: 'relative', height: '200px' }}>
        {/* Baseline line */}
        {baseline && (
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${((maxValue - baseline) / range) * 100}%`,
            height: '1px',
            background: '#06b6d4',
            opacity: 0.3,
            zIndex: 1
          }}>
            <span style={{
              position: 'absolute',
              right: 0,
              top: '-10px',
              fontSize: '10px',
              color: '#06b6d4',
              background: '#0a0a0a',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              Baseline
            </span>
          </div>
        )}

        {/* Data points and lines */}
        <svg style={{ width: '100%', height: '100%' }}>
          {/* Gradient fill */}
          <defs>
            <linearGradient id="hrvGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path
            d={data.map((point, i) => {
              const x = (i / (data.length - 1)) * 100;
              const y = ((maxValue - point.value) / range) * 100;
              return `${i === 0 ? 'M' : 'L'} ${x}% ${y}%`;
            }).join(' ') + ` L 100% 100% L 0% 100% Z`}
            fill="url(#hrvGradient)"
          />

          {/* Line */}
          <polyline
            points={data.map((point, i) => {
              const x = (i / (data.length - 1)) * 100;
              const y = ((maxValue - point.value) / range) * 100;
              return `${x}%,${y}%`;
            }).join(' ')}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((point, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = ((maxValue - point.value) / range) * 100;
            const color = getColor(point.value);
            
            return (
              <g key={i}>
                <circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="4"
                  fill={color}
                  stroke="#0a0a0a"
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '8px'
        }}>
          {data.map((point, i) => (
            <div key={i} style={{
              fontSize: '10px',
              color: '#64748b',
              textAlign: 'center'
            }}>
              {point.date}
            </div>
          ))}
        </div>
      </div>

      {/* Current Value */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '8px',
        border: '1px solid rgba(6,182,212,0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ color: '#94a3b8', fontSize: '14px' }}>
          Current HRV
        </span>
        <span style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: getColor(data[data.length - 1].value)
        }}>
          {data[data.length - 1].value} ms
        </span>
      </div>
    </div>
  );
}