// src/pages/WearableConnect.jsx - Wearable Device OAuth Integration
import React, { useState, useEffect } from 'react';
import { Watch, CheckCircle, X, RefreshCw, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { wearableService } from '../services/api';

export default function WearableConnect() {
  const navigate = useNavigate();
  
  const [connections, setConnections] = useState([]);
  const [syncing, setSyncing] = useState(null);
  const [loading, setLoading] = useState(true);

  const devices = [
    {
      id: 'fitbit',
      name: 'Fitbit',
      description: 'Steps, heart rate, sleep, HRV',
      color: '#00B0B9',
      available: true
    },
    {
      id: 'polar',
      name: 'Polar',
      description: 'Training load, recovery, heart rate zones',
      color: '#FF5252',
      available: true
    },
    {
      id: 'garmin',
      name: 'Garmin',
      description: 'Advanced training metrics, VO2 max',
      color: '#007CC3',
      available: false // Coming soon
    },
    {
      id: 'oura',
      name: 'Oura Ring',
      description: 'Sleep tracking, readiness, HRV',
      color: '#000000',
      available: true
    },
    {
      id: 'whoop',
      name: 'WHOOP',
      description: 'Strain, recovery, sleep performance',
      color: '#000000',
      available: true
    }
  ];

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      const response = await wearableService.getConnections();
      if (response.success) {
        setConnections(response.connections || []);
      }
    } catch (error) {
      console.error('Failed to load connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectDevice = async (provider) => {
    try {
      // In production, this would redirect to OAuth flow
      const authUrl = `${process.env.REACT_APP_API_URL}/wearables/connect/${provider}`;
      
      // Open OAuth window
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        authUrl,
        'Connect Wearable',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for OAuth callback
      const handleMessage = (event) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'wearable_connected') {
          popup?.close();
          loadConnections();
          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);

    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to connect device. Please try again.');
    }
  };

  const syncDevice = async (provider) => {
    setSyncing(provider);
    
    try {
      const response = await wearableService.syncData(provider);
      
      if (response.success) {
        // Update last sync time
        setConnections(connections.map(conn => 
          conn.provider === provider 
            ? { ...conn, lastSync: new Date().toISOString() }
            : conn
        ));
      }
    } catch (error) {
      console.error('Sync error:', error);
      alert('Failed to sync data. Please try again.');
    } finally {
      setSyncing(null);
    }
  };

  const isConnected = (providerId) => {
    return connections.some(conn => conn.provider === providerId);
  };

  const getConnection = (providerId) => {
    return connections.find(conn => conn.provider === providerId);
  };

  const DeviceCard = ({ device }) => {
    const connected = isConnected(device.id);
    const connection = getConnection(device.id);
    const isSyncing = syncing === device.id;

    return (
      <div style={{
        background: connected 
          ? `linear-gradient(135deg, ${device.color}20 0%, ${device.color}10 100%)`
          : 'rgba(148,163,184,0.05)',
        border: connected 
          ? `1px solid ${device.color}40`
          : '1px solid rgba(148,163,184,0.2)',
        borderRadius: '16px',
        padding: '24px',
        position: 'relative'
      }}>
        
        {/* Status Badge */}
        {connected && (
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: `${device.color}30`,
            borderRadius: '12px',
            fontSize: '12px',
            color: device.color,
            fontWeight: 600
          }}>
            <CheckCircle size={14} />
            Connected
          </div>
        )}

        {/* Device Icon */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: connected ? device.color : 'rgba(148,163,184,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <Watch size={28} color={connected ? '#fff' : '#64748b'} />
        </div>

        {/* Device Info */}
        <h3 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: '8px'
        }}>
          {device.name}
        </h3>

        <p style={{
          fontSize: '14px',
          color: '#94a3b8',
          marginBottom: '16px',
          minHeight: '40px'
        }}>
          {device.description}
        </p>

        {/* Last Sync */}
        {connected && connection?.lastSync && (
          <div style={{
            fontSize: '12px',
            color: '#64748b',
            marginBottom: '16px'
          }}>
            Last synced: {new Date(connection.lastSync).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {!device.available ? (
            <button
              disabled
              style={{
                flex: 1,
                padding: '12px',
                background: 'rgba(148,163,184,0.2)',
                border: 'none',
                borderRadius: '8px',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'not-allowed'
              }}
            >
              Coming Soon
            </button>
          ) : connected ? (
            <>
              <button
                onClick={() => syncDevice(device.id)}
                disabled={isSyncing}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: isSyncing 
                    ? 'rgba(148,163,184,0.2)'
                    : `linear-gradient(135deg, ${device.color} 0%, ${device.color}cc 100%)`,
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: isSyncing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <RefreshCw 
                  size={16} 
                  style={{ 
                    animation: isSyncing ? 'spin 1s linear infinite' : 'none' 
                  }} 
                />
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </button>

              <button
                style={{
                  padding: '12px 16px',
                  background: 'rgba(239,68,68,0.2)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={() => connectDevice(device.id)}
              style={{
                flex: 1,
                padding: '12px',
                background: `linear-gradient(135deg, ${device.color} 0%, ${device.color}cc 100%)`,
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Zap size={16} />
              Connect
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#06b6d4'
      }}>
        <Watch className="animate-pulse" size={48} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      padding: '24px',
      position: 'relative'
    }}>
      
      {/* Grid background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        opacity: 0.05,
        backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative'
      }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#06b6d4',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Watch size={36} />
            Wearable Devices
          </h1>

          <button
            onClick={() => navigate('/jarvis')}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(148,163,184,0.2)',
              border: '1px solid rgba(148,163,184,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#94a3b8'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Subtitle */}
        <p style={{
          color: '#94a3b8',
          fontSize: '16px',
          marginBottom: '40px',
          maxWidth: '600px'
        }}>
          Connect your wearable devices to track health metrics, recovery, and performance data automatically.
        </p>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'rgba(6,182,212,0.1)',
            border: '1px solid rgba(6,182,212,0.3)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#06b6d4', marginBottom: '8px' }}>
              {connections.length}
            </div>
            <div style={{ fontSize: '14px', color: '#94a3b8' }}>Connected Devices</div>
          </div>

          <div style={{
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
              {devices.filter(d => d.available).length}
            </div>
            <div style={{ fontSize: '14px', color: '#94a3b8' }}>Available</div>
          </div>

          <div style={{
            background: 'rgba(249,115,22,0.1)',
            border: '1px solid rgba(249,115,22,0.3)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f97316', marginBottom: '8px' }}>
              {devices.length - devices.filter(d => d.available).length}
            </div>
            <div style={{ fontSize: '14px', color: '#94a3b8' }}>Coming Soon</div>
          </div>
        </div>

        {/* Device Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {devices.map(device => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>

        {/* Info Box */}
        <div style={{
          marginTop: '40px',
          background: 'rgba(59,130,246,0.1)',
          border: '1px solid rgba(59,130,246,0.3)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#3b82f6',
            marginBottom: '12px'
          }}>
            💡 How It Works
          </h3>
          <ul style={{
            color: '#94a3b8',
            fontSize: '14px',
            lineHeight: 1.8,
            paddingLeft: '20px'
          }}>
            <li>Connect your devices securely via OAuth 2.0</li>
            <li>Data syncs automatically every 30 minutes</li>
            <li>Phoenix uses your metrics for personalized insights</li>
            <li>Manual sync available anytime for latest data</li>
            <li>Your data is encrypted and never shared</li>
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
