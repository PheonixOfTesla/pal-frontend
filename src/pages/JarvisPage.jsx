// src/pages/JarvisPage.jsx - USES JARVIS CONTEXT
import React, { useState, useEffect } from 'react';
import { Flame, Mic } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { intelligenceService } from '../services/api';
import { useJarvis } from '../context/JarvisContext';
import PhoenixAvatar from '../components/voice/PhoenixAvatar';
import WaveformVisualizer from '../components/voice/WaveformVisualizer';
import DataOverlay from '../components/jarvis/DataOverlay';
import VoiceCommandRouter from '../components/jarvis/VoiceCommandRouter';

export default function JarvisPage() {
  const user = useAuthStore(state => state.user);
  const { intelligenceData, setIntelligenceData, setLoading } = useDataStore();
  const { voiceChat, isActive, activateJarvis } = useJarvis();

  const [activeOverlay, setActiveOverlay] = useState(null);
  const [overlayData, setOverlayData] = useState(null);

  // Auto-activate JARVIS when entering this page
  useEffect(() => {
    activateJarvis();
  }, [activateJarvis]);

  // Fetch intelligence data on mount
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

  // Extract voice chat values safely
  const isConnected = voiceChat?.isConnected || false;
  const isRecording = voiceChat?.isRecording || false;
  const isSpeaking = voiceChat?.isSpeaking || false;
  const phoenixState = voiceChat?.phoenixState || 'idle';
  const transcript = voiceChat?.transcript || '';
  const error = voiceChat?.error || null;
  const startRecording = voiceChat?.startRecording || (() => {});
  const stopRecording = voiceChat?.stopRecording || (() => {});

  const handleShowOverlay = (overlayType, data) => {
    setActiveOverlay(overlayType);
    setOverlayData(data);
  };

  const handleCloseOverlay = () => {
    setActiveOverlay(null);
    setOverlayData(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Animated grid background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.1,
        backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'gridMove 20s linear infinite'
      }} />

      {/* Radial glow from center */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '800px',
        background: `radial-gradient(circle, ${
          phoenixState === 'alert' ? 'rgba(239,68,68,0.2)' :
          phoenixState === 'speaking' ? 'rgba(16,185,129,0.2)' :
          'rgba(6,182,212,0.2)'
        } 0%, transparent 70%)`,
        pointerEvents: 'none',
        transition: 'all 0.5s ease'
      }} />

      {/* Voice Command Router */}
      <VoiceCommandRouter 
        transcript={transcript}
        intelligenceData={intelligenceData}
        onShowOverlay={handleShowOverlay}
      />

      {/* Main Content - Phoenix Avatar */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
        padding: '40px'
      }}>
        
        {/* Phoenix Avatar */}
        <div style={{ marginBottom: '40px' }}>
          <PhoenixAvatar state={phoenixState} />
        </div>

        {/* Status Text */}
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#06b6d4',
          marginBottom: '16px',
          textShadow: '0 0 20px rgba(6,182,212,0.6)',
          textAlign: 'center'
        }}>
          {phoenixState === 'listening' && 'Listening...'}
          {phoenixState === 'thinking' && 'Processing...'}
          {phoenixState === 'speaking' && 'Phoenix Speaking...'}
          {phoenixState === 'alert' && 'Alert!'}
          {phoenixState === 'idle' && `Hello, ${user?.name?.split(' ')[0] || 'there'}`}
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '1rem',
          color: 'rgba(6,182,212,0.7)',
          textAlign: 'center',
          marginBottom: '40px',
          maxWidth: '600px'
        }}>
          {!isActive && 'Voice features disabled. Enable in settings.'}
          {isActive && phoenixState === 'idle' && 'Ask me anything about your health, training, schedule, goals, or finances.'}
          {phoenixState === 'listening' && 'I\'m listening...'}
          {phoenixState === 'thinking' && 'Analyzing your data...'}
          {phoenixState === 'speaking' && 'Let me share what I found...'}
        </p>

        {/* Waveform Visualizer */}
        {isActive && (isRecording || isSpeaking) && (
          <div style={{ width: '100%', maxWidth: '600px', marginBottom: '40px' }}>
            <WaveformVisualizer isActive={isRecording || isSpeaking} />
          </div>
        )}

        {/* Transcript Display */}
        {transcript && (
          <div style={{
            background: 'rgba(6,182,212,0.05)',
            border: '1px solid rgba(6,182,212,0.3)',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '700px',
            width: '100%',
            marginBottom: '40px',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#06b6d4',
              fontWeight: 600,
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Flame size={16} />
              Phoenix:
            </div>
            <div style={{
              fontSize: '16px',
              color: '#fff',
              lineHeight: 1.6
            }}>
              {transcript}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '8px',
            padding: '16px',
            maxWidth: '600px',
            width: '100%',
            marginBottom: '24px',
            color: '#ef4444',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Voice Button */}
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          disabled={!isActive || !isConnected}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: isRecording 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : !isActive || !isConnected
              ? 'rgba(100,116,139,0.3)'
              : 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            border: 'none',
            boxShadow: isRecording 
              ? '0 0 60px rgba(239,68,68,0.8), 0 0 100px rgba(239,68,68,0.4)'
              : '0 8px 32px rgba(6,182,212,0.4)',
            cursor: !isActive || !isConnected ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            transform: isRecording ? 'scale(1.1)' : 'scale(1)',
            position: 'relative'
          }}
        >
          {/* Ripple effect when recording */}
          {isRecording && (
            <>
              <div style={{
                position: 'absolute',
                inset: -10,
                borderRadius: '50%',
                border: '3px solid #ef4444',
                opacity: 0.6,
                animation: 'ripple 1.5s infinite'
              }} />
              <div style={{
                position: 'absolute',
                inset: -20,
                borderRadius: '50%',
                border: '2px solid #ef4444',
                opacity: 0.4,
                animation: 'ripple 1.5s infinite 0.5s'
              }} />
            </>
          )}
          
          <Mic size={48} color={!isActive || !isConnected ? '#64748b' : '#fff'} />
        </button>

        <p style={{
          marginTop: '24px',
          fontSize: '14px',
          color: 'rgba(6,182,212,0.6)',
          textAlign: 'center'
        }}>
          {!isActive ? 'Voice disabled' : isRecording ? 'Release to send' : 'Hold to talk to Phoenix'}
        </p>
      </div>

      {/* Data Overlay */}
      {activeOverlay && (
        <DataOverlay
          type={activeOverlay}
          data={overlayData}
          onClose={handleCloseOverlay}
        />
      )}

      {/* Connection Status */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isConnected ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
        borderRadius: '24px',
        fontSize: '12px',
        color: isConnected ? '#10b981' : '#ef4444',
        fontFamily: 'monospace',
        zIndex: 50
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: isConnected ? '#10b981' : '#ef4444',
          animation: isConnected ? 'pulse 2s infinite' : 'none'
        }} />
        {isConnected ? 'PHOENIX ONLINE' : isActive ? 'CONNECTING...' : 'VOICE DISABLED'}
      </div>

      {/* Time Display */}
      <div style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        fontSize: '12px',
        color: 'rgba(6,182,212,0.6)',
        fontFamily: 'monospace',
        zIndex: 50
      }}>
        {new Date().toLocaleTimeString()}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }

        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
      `}</style>
    </div>
  );
}
