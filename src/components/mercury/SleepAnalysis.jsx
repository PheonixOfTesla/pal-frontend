import React from 'react';
import { Moon, Sun, Star } from 'lucide-react';

export default function SleepAnalysis({ sleepData }) {
  if (!sleepData) return null;

  const { total, deep, rem, light, awake, efficiency, quality } = sleepData;

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getQualityColor = (quality) => {
    if (quality >= 80) return '#10b981';
    if (quality >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const stages = [
    { 
      name: 'Deep Sleep', 
      value: deep, 
      color: '#6366f1',
      icon: <Moon size={16} />,
      description: 'Physical recovery'
    },
    { 
      name: 'REM Sleep', 
      value: rem, 
      color: '#8b5cf6',
      icon: <Star size={16} />,
      description: 'Mental processing'
    },
    { 
      name: 'Light Sleep', 
      value: light, 
      color: '#a78bfa',
      icon: <Sun size={16} />,
      description: 'Transition phases'
    },
    { 
      name: 'Awake', 
      value: awake, 
      color: '#94a3b8',
      icon: null,
      description: 'Interruptions'
    }
  ];

  return (
    <div style={{
      background: 'rgba(139,92,246,0.05)',
      border: '1px solid rgba(139,92,246,0.2)',
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
          <Moon size={28} color="#8b5cf6" />
          <div>
            <h3 style={{ color: '#8b5cf6', fontSize: '18px', fontWeight: 700, margin: 0 }}>
              Sleep Analysis
            </h3>
            <span style={{ color: '#64748b', fontSize: '13px' }}>
              {formatDuration(total)} total
            </span>
          </div>
        </div>
        
        {quality && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
              Quality
            </div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: getQualityColor(quality)
            }}>
              {quality}%
            </div>
          </div>
        )}
      </div>

      {/* Sleep Stages */}
      <div style={{ display: 'grid', gap: '16px', marginBottom: '20px' }}>
        {stages.map((stage) => {
          const percentage = total > 0 ? Math.round((stage.value / total) * 100) : 0;
          
          return (
            <div key={stage.name}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {stage.icon && <span style={{ color: stage.color }}>{stage.icon}</span>}
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                    {stage.name}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: stage.color }}>
                    {formatDuration(stage.value)}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b', minWidth: '40px', textAlign: 'right' }}>
                    {percentage}%
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div style={{
                height: '6px',
                background: 'rgba(148,163,184,0.1)',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${percentage}%`,
                  background: stage.color,
                  borderRadius: '3px',
                  transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </div>
              
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                {stage.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sleep Efficiency */}
      {efficiency && (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid rgba(139,92,246,0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>
            Sleep Efficiency
          </span>
          <span style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: efficiency >= 85 ? '#10b981' : efficiency >= 75 ? '#f59e0b' : '#ef4444'
          }}>
            {efficiency}%
          </span>
        </div>
      )}
    </div>
  );
}