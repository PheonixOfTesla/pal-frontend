import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Moon, Activity, Zap, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { intelligenceService, wearableService } from '../services/api';

export default function MercuryPage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { intelligenceData, setIntelligenceData, loading, setLoading } = useDataStore();
  
  const [wearableConnections, setWearableConnections] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  // Fetch intelligence data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;
      
      setLoading(true);
      try {
        const [intelligenceRes, connectionsRes] = await Promise.all([
          intelligenceService.getHealthMetrics(user._id),
          wearableService.getConnections().catch(() => ({ connections: [] }))
        ]);
        
        if (intelligenceRes.success) {
          setIntelligenceData(intelligenceRes.data);
          setLastSync(new Date());
        }
        
        if (connectionsRes.connections) {
          setWearableConnections(connectionsRes.connections);
        }
      } catch (error) {
        console.error('Failed to fetch Mercury data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, setIntelligenceData, setLoading]);

  // Manual sync
  const handleSync = async () => {
    if (!wearableConnections.length || syncing) return;
    
    setSyncing(true);
    try {
      const provider = wearableConnections[0].provider;
      await wearableService.syncData(provider);
      
      // Refresh intelligence data
      const response = await intelligenceService.getHealthMetrics(user._id);
      if (response.success) {
        setIntelligenceData(response.data);
        setLastSync(new Date());
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  const metrics = intelligenceData?.metrics || {};
  const healthMetrics = intelligenceData?.healthMetrics || {};
  const dataQuality = intelligenceData?.dataQuality || {};

  // Calculate trend indicators
  const getTrend = (current, previous) => {
    if (!current || !previous) return 'stable';
    const change = ((current - previous) / previous) * 100;
    if (change > 5) return 'up';
    if (change < -5) return 'down';
    return 'stable';
  };

  const TrendIcon = ({ trend }) => {
    if (trend === 'up') return <TrendingUp size={16} color="#10b981" />;
    if (trend === 'down') return <TrendingDown size={16} color="#ef4444" />;
    return <Minus size={16} color="#94a3b8" />;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', position: 'relative' }}>
      
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10,10,10,0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(148,163,184,0.1)',
        padding: '16px 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => navigate('/jarvis')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '8px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#06b6d4'}
            onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
          >
            <ArrowLeft size={20} />
            <span>Back to JARVIS</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {lastSync && (
              <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>
                Last sync: {lastSync.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={handleSync}
              disabled={syncing || !wearableConnections.length}
              style={{
                padding: '8px 16px',
                background: syncing ? 'rgba(100,116,139,0.2)' : 'rgba(148,163,184,0.1)',
                border: '1px solid rgba(148,163,184,0.3)',
                borderRadius: '6px',
                color: syncing ? '#64748b' : '#94a3b8',
                fontSize: '12px',
                cursor: syncing || !wearableConnections.length ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Title Section */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            ☿️ Mercury
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            Vitals & Recovery Tracking
          </p>
        </div>

        {/* Connection Status */}
        {!dataQuality.wearable && (
          <div style={{
            background: 'rgba(251,191,36,0.1)',
            border: '1px solid rgba(251,191,36,0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Zap size={20} color="#fbbf24" />
              <div>
                <p style={{ color: '#fbbf24', fontWeight: 600, marginBottom: '4px' }}>
                  No Wearable Connected
                </p>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                  Connect a device to track heart rate, sleep, and recovery metrics
                </p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid rgba(148,163,184,0.2)',
              borderTopColor: '#94a3b8',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
            <p style={{ color: '#64748b', marginTop: '16px' }}>Loading vitals data...</p>
          </div>
        ) : (
          <>
            {/* Primary Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              
              {/* Recovery Score */}
              <MetricCard
                icon={<Zap size={24} color="#10b981" />}
                title="Recovery Score"
                value={metrics.recoveryScore || 0}
                unit="/100"
                trend={getTrend(metrics.recoveryScore, 75)}
                color="#10b981"
                description={
                  metrics.recoveryScore >= 70 ? "Excellent - Ready for intense training" :
                  metrics.recoveryScore >= 50 ? "Good - Moderate training recommended" :
                  metrics.recoveryScore >= 30 ? "Low - Active recovery only" :
                  "Critical - Rest day required"
                }
              />

              {/* Heart Rate */}
              <MetricCard
                icon={<Heart size={24} color="#ef4444" />}
                title="Resting Heart Rate"
                value={metrics.restingHR || healthMetrics?.recovery?.restingHR || 0}
                unit="bpm"
                trend={getTrend(metrics.restingHR, 65)}
                color="#ef4444"
                description={
                  metrics.restingHR < 60 ? "Excellent cardiovascular fitness" :
                  metrics.restingHR < 70 ? "Good resting heart rate" :
                  "Elevated - may indicate stress"
                }
              />

              {/* HRV */}
              <MetricCard
                icon={<Activity size={24} color="#06b6d4" />}
                title="Heart Rate Variability"
                value={metrics.hrv || healthMetrics?.recovery?.hrv || 0}
                unit="ms"
                trend={getTrend(metrics.hrv, 60)}
                color="#06b6d4"
                description={
                  metrics.hrv >= 70 ? "Excellent recovery capacity" :
                  metrics.hrv >= 50 ? "Good HRV for training" :
                  metrics.hrv >= 30 ? "Low HRV - reduce intensity" :
                  "Critical HRV - prioritize recovery"
                }
              />

              {/* Sleep */}
              <MetricCard
                icon={<Moon size={24} color="#8b5cf6" />}
                title="Sleep Duration"
                value={Math.floor((metrics.sleep || 0) / 60)}
                unit={`h ${(metrics.sleep || 0) % 60}m`}
                trend={getTrend(metrics.sleep, 480)}
                color="#8b5cf6"
                description={
                  metrics.sleep >= 480 ? "Optimal sleep duration" :
                  metrics.sleep >= 420 ? "Adequate sleep" :
                  metrics.sleep >= 360 ? "Below optimal - aim for 8h" :
                  "Sleep debt accumulating"
                }
              />
            </div>

            {/* Sleep Breakdown */}
            {healthMetrics?.sleep && (
              <div style={{
                background: 'rgba(139,92,246,0.05)',
                border: '1px solid rgba(139,92,246,0.2)',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px'
              }}>
                <h3 style={{ color: '#8b5cf6', fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>
                  Sleep Analysis
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                  <SleepStat label="Deep Sleep" value={healthMetrics.sleep.deep || 0} total={metrics.sleep || 0} color="#6366f1" />
                  <SleepStat label="REM Sleep" value={healthMetrics.sleep.rem || 0} total={metrics.sleep || 0} color="#8b5cf6" />
                  <SleepStat label="Light Sleep" value={healthMetrics.sleep.light || 0} total={metrics.sleep || 0} color="#a78bfa" />
                  <SleepStat label="Awake" value={healthMetrics.sleep.awake || 0} total={metrics.sleep || 0} color="#94a3b8" />
                </div>

                {healthMetrics.sleep.efficiency && (
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(139,92,246,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '14px' }}>Sleep Efficiency</span>
                      <span style={{ color: '#8b5cf6', fontSize: '24px', fontWeight: 'bold' }}>
                        {healthMetrics.sleep.efficiency}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Activity Overview */}
            <div style={{
              background: 'rgba(148,163,184,0.05)',
              border: '1px solid rgba(148,163,184,0.2)',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <h3 style={{ color: '#94a3b8', fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>
                Activity Overview
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <ActivityStat
                  label="Steps"
                  value={(metrics.steps || 0).toLocaleString()}
                  target="10,000"
                  progress={Math.min((metrics.steps / 10000) * 100, 100)}
                />
                <ActivityStat
                  label="Active Minutes"
                  value={healthMetrics?.activity?.activeMinutes || 0}
                  target="30"
                  progress={Math.min(((healthMetrics?.activity?.activeMinutes || 0) / 30) * 100, 100)}
                />
                <ActivityStat
                  label="Calories Burned"
                  value={(healthMetrics?.activity?.calories || 0).toLocaleString()}
                  target="2,500"
                  progress={Math.min(((healthMetrics?.activity?.calories || 0) / 2500) * 100, 100)}
                />
              </div>
            </div>

            {/* Data Quality Indicator */}
            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(100,116,139,0.05)', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Data Sources:</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <DataBadge label="Wearable" active={dataQuality.wearable} />
                <DataBadge label="Sleep" active={dataQuality.sleep} />
                <DataBadge label="Activity" active={dataQuality.activity} />
              </div>
            </div>
          </>
        )}
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

// Metric Card Component
function MetricCard({ icon, title, value, unit, trend, color, description }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(148,163,184,0.1)',
      borderRadius: '12px',
      padding: '20px',
      transition: 'all 0.2s',
      cursor: 'default'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
      e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
      e.currentTarget.style.borderColor = 'rgba(148,163,184,0.1)';
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon}
          <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500 }}>{title}</span>
        </div>
        <TrendIcon trend={trend} />
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <span style={{ fontSize: '36px', fontWeight: 'bold', color, lineHeight: 1 }}>
          {value}
        </span>
        <span style={{ fontSize: '18px', color: '#64748b', marginLeft: '4px' }}>
          {unit}
        </span>
      </div>
      
      <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.4 }}>
        {description}
      </p>
    </div>
  );
}

// Sleep Stat Component
function SleepStat({ label, value, total, color }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', color: '#94a3b8' }}>{label}</span>
        <span style={{ fontSize: '14px', fontWeight: 600, color }}>{Math.round(value)}m</span>
      </div>
      <div style={{ 
        height: '6px', 
        background: 'rgba(148,163,184,0.1)', 
        borderRadius: '3px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          height: '100%', 
          width: `${percentage}%`, 
          background: color,
          transition: 'width 0.3s'
        }}></div>
      </div>
      <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
        {percentage}%
      </span>
    </div>
  );
}

// Activity Stat Component
function ActivityStat({ label, value, target, progress }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
        <span style={{ fontSize: '13px', color: '#94a3b8' }}>{label}</span>
        <span style={{ fontSize: '11px', color: '#64748b' }}>Target: {target}</span>
      </div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px' }}>
        {value}
      </div>
      <div style={{ 
        height: '8px', 
        background: 'rgba(148,163,184,0.1)', 
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          height: '100%', 
          width: `${progress}%`, 
          background: progress >= 100 ? '#10b981' : '#94a3b8',
          transition: 'width 0.3s'
        }}></div>
      </div>
    </div>
  );
}

// Data Badge Component
function DataBadge({ label, active }) {
  return (
    <div style={{
      padding: '4px 12px',
      borderRadius: '12px',
      background: active ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.1)',
      border: `1px solid ${active ? 'rgba(16,185,129,0.3)' : 'rgba(100,116,139,0.2)'}`,
      fontSize: '12px',
      color: active ? '#10b981' : '#64748b',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    }}>
      <div style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: active ? '#10b981' : '#64748b'
      }}></div>
      {label}
    </div>
  );
}

// Trend Icon Component
function TrendIcon({ trend }) {
  if (trend === 'up') return <TrendingUp size={16} color="#10b981" />;
  if (trend === 'down') return <TrendingDown size={16} color="#ef4444" />;
  return <Minus size={16} color="#94a3b8" />;
}