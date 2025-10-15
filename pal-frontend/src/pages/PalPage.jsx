import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PalPage() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/jarvis')}
      style={{
        height: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle animated background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.1,
        backgroundImage: 'radial-gradient(circle at center, cyan 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      {/* PAL Face */}
      <div style={{ marginBottom: '48px', position: 'relative', zIndex: 10 }}>
        <svg viewBox="0 0 300 300" style={{ width: '256px', height: '256px' }}>
          {/* Eyes */}
          <path d="M 80 80 Q 90 70 100 80" fill="none" stroke="cyan" strokeWidth="12" strokeLinecap="round" opacity="0.8"/>
          <path d="M 200 80 Q 210 70 220 80" fill="none" stroke="cyan" strokeWidth="12" strokeLinecap="round" opacity="0.8"/>
          
          {/* Nose */}
          <rect x="120" y="120" width="20" height="80" rx="10" fill="cyan" opacity="0.8"/>
          <rect x="160" y="120" width="20" height="80" rx="10" fill="cyan" opacity="0.8"/>
          
          {/* Mouth */}
          <path d="M 80 240 Q 150 250 220 240" fill="none" stroke="cyan" strokeWidth="12" strokeLinecap="round" opacity="0.8"/>
          
          {/* Glow */}
          <circle cx="150" cy="150" r="140" fill="none" stroke="cyan" strokeWidth="2" opacity="0.1"/>
          <circle cx="150" cy="150" r="145" fill="none" stroke="cyan" strokeWidth="1" opacity="0.05"/>
        </svg>
      </div>

      {/* Text */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#06b6d4',
          marginBottom: '16px',
          textShadow: '0 0 20px rgba(6,182,212,0.5)'
        }}>
          Tap to Talk
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'rgba(6,182,212,0.7)', fontWeight: 500 }}>
          Monitoring vitals and performance
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: '#06b6d4',
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }}></div>
          <span style={{ fontSize: '14px', color: 'rgba(6,182,212,0.5)', fontFamily: 'monospace' }}>
            Phoenix Active
          </span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}