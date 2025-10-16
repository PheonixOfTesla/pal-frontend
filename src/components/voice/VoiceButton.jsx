// src/components/voice/VoiceButton.jsx
import React from 'react';
import { Mic, MicOff } from 'lucide-react';

export default function VoiceButton({ isRecording, isConnected, onStart, onStop, disabled }) {
  return (
    <button
      onMouseDown={onStart}
      onMouseUp={onStop}
      onTouchStart={onStart}
      onTouchEnd={onStop}
      disabled={disabled || !isConnected}
      style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: isRecording 
          ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
          : disabled || !isConnected
          ? 'rgba(100,116,139,0.3)'
          : 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        border: 'none',
        boxShadow: isRecording 
          ? '0 0 40px rgba(239,68,68,0.6)'
          : '0 8px 24px rgba(6,182,212,0.4)',
        cursor: disabled || !isConnected ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        transform: isRecording ? 'scale(1.1)' : 'scale(1)',
        animation: isRecording ? 'pulse 1s infinite' : 'none',
        position: 'relative'
      }}
    >
      {/* Ripple effect */}
      {isRecording && (
        <div style={{
          position: 'absolute',
          inset: -10,
          borderRadius: '50%',
          border: '2px solid #ef4444',
          opacity: 0.5,
          animation: 'ripple 1.5s infinite'
        }} />
      )}
      
      {isRecording ? (
        <MicOff size={48} color="#fff" />
      ) : (
        <Mic size={48} color={disabled || !isConnected ? '#64748b' : '#fff'} />
      )}
    </button>
  );
}

// src/components/voice/PhoenixAvatar.jsx
import React from 'react';
import { Flame } from 'lucide-react';

export default function PhoenixAvatar({ state }) {
  // state: 'idle' | 'listening' | 'thinking' | 'speaking' | 'alert'
  
  const getStateConfig = () => {
    switch (state) {
      case 'listening':
        return {
          color: '#f59e0b',
          glow: 'rgba(245,158,11,0.8)',
          animation: 'pulse 1s infinite',
          message: 'Listening...'
        };
      case 'thinking':
        return {
          color: '#8b5cf6',
          glow: 'rgba(139,92,246,0.8)',
          animation: 'spin 2s linear infinite',
          message: 'Processing...'
        };
      case 'speaking':
        return {
          color: '#10b981',
          glow: 'rgba(16,185,129,0.8)',
          animation: 'pulse 0.5s infinite',
          message: 'Phoenix speaking...'
        };
      case 'alert':
        return {
          color: '#ef4444',
          glow: 'rgba(239,68,68,0.9)',
          animation: 'shake 0.5s infinite',
          message: 'Alert!'
        };
      default: // idle
        return {
          color: '#06b6d4',
          glow: 'rgba(6,182,212,0.5)',
          animation: 'float 3s ease-in-out infinite',
          message: 'Ready'
        };
    }
  };

  const config = getStateConfig();

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Avatar Container */}
      <div style={{
        position: 'relative',
        width: '200px',
        height: '200px',
        margin: '0 auto 24px'
      }}>
        {/* Outer glow ring */}
        <div style={{
          position: 'absolute',
          inset: -20,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
          animation: config.animation,
          pointerEvents: 'none'
        }} />
        
        {/* Main avatar */}
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'rgba(10,10,10,0.9)',
          border: `3px solid ${config.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 40px ${config.glow}`,
          animation: config.animation
        }}>
          <Flame size={80} color={config.color} />
        </div>

        {/* Orbital rings */}
        <svg style={{
          position: 'absolute',
          inset: -30,
          animation: 'spin 20s linear infinite',
          pointerEvents: 'none'
        }} viewBox="0 0 260 260">
          <circle 
            cx="130" 
            cy="130" 
            r="125" 
            fill="none" 
            stroke={config.color}
            strokeWidth="1" 
            opacity="0.3"
          />
          <circle 
            cx="130" 
            cy="130" 
            r="115" 
            fill="none" 
            stroke={config.color}
            strokeWidth="1" 
            opacity="0.2"
          />
        </svg>
      </div>

      {/* Status text */}
      <div style={{
        fontSize: '18px',
        fontWeight: 600,
        color: config.color,
        textShadow: `0 0 10px ${config.glow}`
      }}>
        {config.message}
      </div>
    </div>
  );
}

// src/components/voice/TranscriptDisplay.jsx
import React, { useEffect, useRef } from 'react';

export default function TranscriptDisplay({ transcript, isSpeaking }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcript]);

  if (!transcript) return null;

  return (
    <div
      ref={containerRef}
      style={{
        background: 'rgba(6,182,212,0.05)',
        border: '1px solid rgba(6,182,212,0.3)',
        borderRadius: '12px',
        padding: '20px',
        maxHeight: '200px',
        overflowY: 'auto',
        marginTop: '24px'
      }}
    >
      <div style={{
        fontSize: '14px',
        color: '#06b6d4',
        marginBottom: '8px',
        fontWeight: 600
      }}>
        Phoenix:
      </div>
      <div style={{
        fontSize: '16px',
        color: '#fff',
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap'
      }}>
        {transcript}
        {isSpeaking && (
          <span style={{
            display: 'inline-block',
            width: '8px',
            height: '16px',
            background: '#06b6d4',
            marginLeft: '4px',
            animation: 'blink 1s infinite'
          }} />
        )}
      </div>
    </div>
  );
}

// src/components/voice/WaveformVisualizer.jsx
import React, { useRef, useEffect } from 'react';

export default function WaveformVisualizer({ isActive, audioData }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const dataArrayRef = useRef(new Uint8Array(128));

  useEffect(() => {
    if (!isActive || !canvasRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, width, height);

      const barWidth = (width / dataArrayRef.current.length) * 2;
      let x = 0;

      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const barHeight = (dataArrayRef.current[i] / 255) * height * 0.8;
        
        const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
        gradient.addColorStop(0, '#06b6d4');
        gradient.addColorStop(1, '#0891b2');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
        
        x += barWidth;
      }

      // Generate fake waveform data (replace with real audio analysis)
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        dataArrayRef.current[i] = Math.random() * 255;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={80}
      style={{
        width: '100%',
        height: '80px',
        borderRadius: '8px',
        background: 'rgba(6,182,212,0.05)',
        border: '1px solid rgba(6,182,212,0.2)',
        marginTop: '16px'
      }}
    />
  );
}

// Add keyframe animations
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }

  @keyframes ripple {
    0% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(1.5); opacity: 0; }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
`;
document.head.appendChild(style);
