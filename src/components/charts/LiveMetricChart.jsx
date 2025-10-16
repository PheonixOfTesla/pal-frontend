// src/components/charts/LiveMetricChart.jsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useRealtimeData from '../../hooks/useRealtimeData';

export default function LiveMetricChart({ userId, metricType, title, color = '#3b82f6' }) {
  const { subscribeToMetric } = useRealtimeData(userId);
  const [data, setData] = useState([]);
  const [currentValue, setCurrentValue] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToMetric(metricType, (metric) => {
      const timestamp = new Date(metric.timestamp).toLocaleTimeString();
      
      setData(prev => {
        const newData = [...prev, { time: timestamp, value: metric.value }];
        // Keep only last 20 data points
        return newData.slice(-20);
      });

      setCurrentValue(metric.value);
    });

    return unsubscribe;
  }, [metricType, subscribeToMetric]);

  return (
    <div style={{
      background: 'rgba(148,163,184,0.05)',
      border: '1px solid rgba(148,163,184,0.1)',
      borderRadius: '16px',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          fontSize: '14px', 
          color: '#64748b', 
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {title}
        </div>
        {currentValue !== null && (
          <div style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: color,
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px'
          }}>
            {currentValue}
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: color,
              animation: 'pulse 2s ease-in-out infinite',
              display: 'inline-block'
            }} />
          </div>
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
          <XAxis 
            dataKey="time" 
            stroke="#64748b"
            fontSize={12}
            tick={{ fill: '#64748b' }}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
            tick={{ fill: '#64748b' }}
          />
          <Tooltip
            contentStyle={{
              background: '#1e293b',
              border: '1px solid rgba(148,163,184,0.2)',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color}
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}