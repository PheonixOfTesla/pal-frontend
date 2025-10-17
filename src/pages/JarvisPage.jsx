// src/pages/JarvisPage.jsx - WITH WORKING VOICE CHAT
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, ArrowLeft, Mic } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { intelligenceService } from '../services/api';
import VoiceChatPanel from '../components/voice/VoiceChatPanel';

export default function JarvisPage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { intelligenceData, setIntelligenceData, loading, setLoading } = useDataStore();
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showVoiceChat, setShowVoiceChat] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;
      
      setLoading(true);
      try {
        const response = await intelligenceService.getHealthMetrics(user._id);
        if (response.success) {
          setIntelligenceData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch intelligence data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, setIntelligenceData, setLoading]);

  // Simulate speaking when entering
  useEffect(() => {
    setIsSpeaking(true);
    const timer = setTimeout(() => setIsSpeaking(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const metrics = intelligenceData?.metrics || {};

  return (
    <div style={{ minHeight: '100vh', background: '#000', position: 'relative', overflow: 'hidden' }}>
      
      {/* Animated background grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.2,
        backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      {/* Voice Chat Overlay */}
      {showVoiceChat && (
        <VoiceChatPanel onClose={() => setShowVoiceChat(false)} />
      )}

      {/* Header */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '24px',
        borderBottom: '1px solid rgba(6,182,212,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#06b6d4',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          <ArrowLeft size={20} />
          <span>Back to Phoenix</span>
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Flame size={24} color="#f97316" style={{ animation: 'pulse 2s infinite' }} />
          <span style={{ color: '#06b6d4', fontWeight: 'bold', fontSize: '18px' }}>
            Phoenix Active
          </span>
        </div>

        <div style={{ fontSize: '12px', color: 'rgba(6,182,212,0.6)', fontFamily: 'monospace' }}>
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        height: 'calc(100vh - 180px)'
      }}>
        
        {/* LEFT COLUMN - Vitals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Date Circle */}
          <div style={{
            background: 'rgba(6,182,212,0.05)',
            border: '1px solid rgba(6,182,212,0.3)',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', color: '#06b6d4', marginBottom: '8px' }}>
              {new Date().toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
            </div>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#06b6d4' }}>
              {new Date().getDate()}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(6,182,212,0.6)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </div>
          </div>

          {/* Stats */}
          <div style={{
            background: 'rgba(6,182,212,0.05)',
            border: '1px solid rgba(6,182,212,0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ fontSize: '12px', color: '#06b6d4', marginBottom: '16px' }}>VITALS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'rgba(6,182,212,0.6)' }}>Steps</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4' }}>
                  {loading ? '...' : (metrics.steps || 0).toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'rgba(6,182,212,0.6)' }}>Sleep</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4' }}>
                  {loading ? '...' : `${Math.floor((metrics.sleep || 0) / 60)}h ${(metrics.sleep || 0) % 60}m`}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'rgba(6,182,212,0.6)' }}>Recovery</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4' }}>
                  {loading ? '...' : (metrics.recoveryScore || 0)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN - Main Display */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Central Hub */}
          <div style={{ position: 'relative', width: '256px', height: '256px', marginBottom: '32px' }}>
            {/* Outer rings */}
            <svg style={{
              position: 'absolute',
              inset: 0,
              animation: 'spin 20s linear infinite'
            }} viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="95" fill="none" stroke="cyan" strokeWidth="1" opacity="0.2"/>
              <circle cx="100" cy="100" r="85" fill="none" stroke="cyan" strokeWidth="1" opacity="0.3"/>
            </svg>
            
            {/* Main circle */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '128px',
                height: '128px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isSpeaking ? '0 0 60px rgba(6,182,212,0.8)' : '0 0 30px rgba(6,182,212,0.5)',
                transform: isSpeaking ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s'
              }}>
                <Flame size={64} color="#fff" />
              </div>
            </div>
          </div>

          {/* Planet Labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', fontSize: '12px', fontFamily: 'monospace' }}>
            <div style={{ textAlign: 'center', color: '#06b6d4', cursor: 'pointer' }} onClick={() => navigate('/mercury')}>
              Mercury<br/>Vitals
            </div>
            <div style={{ textAlign: 'center', color: '#06b6d4', cursor: 'pointer' }} onClick={() => navigate('/venus')}>
              Venus<br/>Training
            </div>
            <div style={{ textAlign: 'center', color: '#06b6d4', cursor: 'pointer' }} onClick={() => navigate('/earth')}>
              Earth<br/>Schedule
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', fontSize: '12px', fontFamily: 'monospace', marginTop: '8px' }}>
            <div style={{ textAlign: 'center', color: '#06b6d4', cursor: 'pointer' }} onClick={() => navigate('/mars')}>
              Mars<br/>Goals
            </div>
            <div style={{ textAlign: 'center', color: '#06b6d4', cursor: 'pointer' }} onClick={() => navigate('/jupiter')}>
              Jupiter<br/>Wealth
            </div>
            <div style={{ textAlign: 'center', color: '#06b6d4', cursor: 'pointer' }} onClick={() => navigate('/saturn')}>
              Saturn<br/>Legacy
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - System Tools */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: 'rgba(6,182,212,0.05)',
            border: '1px solid rgba(6,182,212,0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ fontSize: '12px', color: '#06b6d4', marginBottom: '12px' }}>SYSTEM STATUS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', fontFamily: 'monospace' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#06b6d4' }}>
                <div style={{ width: '8px', height: '8px', background: '#06b6d4', borderRadius: '50%' }}></div>
                <span>All Systems Online</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#06b6d4' }}>
                <div style={{ width: '8px', height: '8px', background: '#06b6d4', borderRadius: '50%' }}></div>
                <span>AI Engine Active</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#06b6d4' }}>
                <div style={{ width: '8px', height: '8px', background: '#06b6d4', borderRadius: '50%' }}></div>
                <span>Data Synced</span>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(6,182,212,0.05)',
            border: '1px solid rgba(6,182,212,0.3)',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '12px', color: '#06b6d4', fontWeight: 'bold', marginBottom: '8px' }}>
              Quick Stats
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', fontFamily: 'monospace', color: 'rgba(6,182,212,0.6)' }}>
              <div>• Workouts: {metrics.workoutsThisWeek || 0} this week</div>
              <div>• Goals: {metrics.activeGoalsCount || 0} active</div>
              <div>• Training Load: {metrics.trainingLoad || 0}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Voice Button */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20 }}>
        <div style={{
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(6,182,212,0.3)',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px'
        }}>
          <span style={{ color: '#06b6d4', fontSize: '14px', fontFamily: 'monospace' }}>
            Talk to Phoenix
          </span>
          <button
            onClick={() => setShowVoiceChat(true)}
            style={{
              padding: '12px',
              borderRadius: '50%',
              background: 'rgba(6,182,212,0.2)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(6,182,212,0.4)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(6,182,212,0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Mic size={20} color="#06b6d4" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
