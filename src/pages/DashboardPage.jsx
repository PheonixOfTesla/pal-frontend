import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#06b6d4' }}>
            Dashboard
          </h1>
          <button
            onClick={handleLogout}
            style={{
              padding: '12px 24px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px',
              color: '#ef4444',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        {/* User Info */}
        <div style={{
          background: 'rgba(6,182,212,0.05)',
          border: '1px solid rgba(6,182,212,0.3)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h2 style={{ color: '#06b6d4', marginBottom: '16px' }}>Welcome, {user?.name}</h2>
          <p style={{ color: '#94a3b8' }}>Email: {user?.email}</p>
          <p style={{ color: '#94a3b8' }}>Role: {user?.roles?.join(', ')}</p>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '24px',
              background: 'rgba(6,182,212,0.05)',
              border: '1px solid rgba(6,182,212,0.3)',
              borderRadius: '12px',
              color: '#06b6d4',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 600
            }}
          >
            🔮 Phoenix Interface
          </button>
          
          <button
            onClick={() => navigate('/mercury')}
            style={{
              padding: '24px',
              background: 'rgba(6,182,212,0.05)',
              border: '1px solid rgba(6,182,212,0.3)',
              borderRadius: '12px',
              color: '#06b6d4',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 600
            }}
          >
            ☿️ Mercury (Vitals)
          </button>
          
          <button
            onClick={() => navigate('/venus')}
            style={{
              padding: '24px',
              background: 'rgba(6,182,212,0.05)',
              border: '1px solid rgba(6,182,212,0.3)',
              borderRadius: '12px',
              color: '#06b6d4',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 600
            }}
          >
            ♀️ Venus (Training)
          </button>
        </div>
      </div>
    </div>
  );
}