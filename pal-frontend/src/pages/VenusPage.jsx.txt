import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function VenusPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '24px' }}>
      <button
        onClick={() => navigate('/jarvis')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: '#06b6d4',
          cursor: 'pointer',
          fontSize: '14px',
          marginBottom: '24px'
        }}
      >
        <ArrowLeft size={20} />
        <span>Back to JARVIS</span>
      </button>

      <h1 style={{ fontSize: '2.5rem', color: '#06b6d4', marginBottom: '16px' }}>
        ♀️ Venus - Training
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '18px' }}>
        Workouts, exercises, goals, nutrition tracking
      </p>

      <div style={{
        marginTop: '32px',
        padding: '32px',
        background: 'rgba(6,182,212,0.05)',
        border: '1px solid rgba(6,182,212,0.3)',
        borderRadius: '12px'
      }}>
        <p style={{ color: '#64748b', fontSize: '16px' }}>
          Coming soon: Full training dashboard with workout logging and nutrition tracking
        </p>
      </div>
    </div>
  );
}