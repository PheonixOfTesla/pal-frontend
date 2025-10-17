// src/components/voice/VoiceChatPanel.jsx - COMPLETE Voice Chat Component
import React from 'react';
import { X } from 'lucide-react';
import { useWebVoiceChat } from '../../hooks/useWebVoiceChat';
import VoiceButton from './VoiceButton';
import PhoenixAvatar from './PhoenixAvatar';
import WaveformVisualizer from './WaveformVisualizer';

export default function VoiceChatPanel({ onClose }) {
  const {
    isConnected,
    isRecording,
    isSpeaking,
    phoenixState,
    transcript,
    error,
    startRecording,
    stopRecording,
    interrupt
  } = useWebVoiceChat();

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.95)',
      backdropFilter: 'blur(10px)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          background: 'rgba(148,163,184,0.1)',
          border: '1px solid rgba(148,163,184,0.3)',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#94a3b8',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(148,163,184,0.2)';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(148,163,184,0.1)';
          e.currentTarget.style.color = '#94a3b8';
        }}
      >
        <X size={24} />
      </button>

      {/* Phoenix Avatar */}
      <div style={{ marginBottom: '40px' }}>
        <PhoenixAvatar state={phoenixState} />
      </div>

      {/* Waveform */}
      {isRecording && (
        <div style={{ width: '100%', maxWidth: '600px', marginBottom: '24px' }}>
          <WaveformVisualizer isActive={isRecording} />
        </div>
      )}

      {/* Transcript */}
      {transcript && (
        <div style={{
          background: 'rgba(6,182,212,0.05)',
          border: '1px solid rgba(6,182,212,0.3)',
          borderRadius: '12px',
          padding: '20px',
          maxWidth: '600px',
          width: '100%',
          marginBottom: '24px',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          <div style={{ fontSize: '14px', color: '#06b6d4', fontWeight: 600, marginBottom: '8px' }}>
            Phoenix:
          </div>
          <div style={{ fontSize: '16px', color: '#fff', lineHeight: 1.6 }}>
            {transcript}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '8px',
          padding: '16px',
          maxWidth: '600px',
          width: '100%',
          marginBottom: '24px',
          color: '#ef4444'
        }}>
          {error}
        </div>
      )}

      {/* Voice Button */}
      <div style={{ marginBottom: '16px' }}>
        <VoiceButton
          isRecording={isRecording}
          isConnected={isConnected}
          onStart={startRecording}
          onStop={stopRecording}
        />
      </div>

      {/* Instructions */}
      <p style={{ fontSize: '14px', color: '#64748b', textAlign: 'center' }}>
        {isRecording ? 'Release to send' : 'Hold to talk to Phoenix'}
      </p>

      {/* Interrupt Button (if speaking) */}
      {isSpeaking && (
        <button
          onClick={interrupt}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            background: 'rgba(239,68,68,0.2)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: '8px',
            color: '#ef4444',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Interrupt
        </button>
      )}

      {/* Connection Status */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
        color: isConnected ? '#10b981' : '#ef4444'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: isConnected ? '#10b981' : '#ef4444',
          animation: isConnected ? 'pulse 2s infinite' : 'none'
        }} />
        {isConnected ? 'Connected to Phoenix' : 'Connecting...'}
      </div>
    </div>
  );
}