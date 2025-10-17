// src/pages/PalPage.jsx - Phoenix Greets You Immediately
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function PalPage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const [greeting, setGreeting] = useState('');
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Determine greeting based on time of day
    const hour = new Date().getHours();
    let timeGreeting = 'Good evening';
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 18) timeGreeting = 'Good afternoon';

    const greetingText = `${timeGreeting}, ${user?.name?.split(' ')[0] || 'there'}. I'm Phoenix, your AI companion. I've been monitoring your vitals and analyzing your patterns. Ready to see what I've learned?`;
    
    setGreeting(greetingText);

    // Speak greeting
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(greetingText);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Wait a moment then speak
      setTimeout(() => {
        speechSynthesis.speak(utterance);
      }, 1000);
    }

    // Auto-transition to Jarvis after greeting
    const timer = setTimeout(() => {
      navigate('/jarvis');
    }, 8000); // 8 seconds - enough time for greeting

    return () => {
      clearTimeout(timer);
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, [navigate, user]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #0f172a 50%, #0a0a0a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Animated grid background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.15,
        backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'gridMove 20s linear infinite'
      }} />

      {/* Radial glow */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)',
        animation: 'pulse 4s ease-in-out infinite'
      }} />

      {/* Phoenix Avatar */}
      <div style={{
        position: 'relative',
        width: '320px',
        height: '320px',
        marginBottom: '48px',
        animation: 'float 6s ease-in-out infinite'
      }}>
        {/* Outer orbital rings */}
        <svg style={{
          position: 'absolute',
          inset: -40,
          animation: 'spin 30s linear infinite'
        }} viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="180" fill="none" stroke="cyan" strokeWidth="1" opacity="0.2"/>
          <circle cx="200" cy="200" r="160" fill="none" stroke="cyan" strokeWidth="1" opacity="0.3"/>
        </svg>

        {/* Inner glow */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)',
          animation: 'pulse 2s ease-in-out infinite'
        }} />

        {/* Main circle */}
        <div style={{
          position: 'absolute',
          inset: 40,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 60px rgba(6,182,212,0.6)',
          border: '2px solid rgba(6,182,212,0.8)'
        }}>
          <Flame size={120} color="#fff" style={{ 
            filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.8))',
            animation: 'flicker 3s ease-in-out infinite'
          }} />
        </div>
      </div>

      {/* Greeting Text */}
      <div style={{
        maxWidth: '700px',
        textAlign: 'center',
        padding: '0 32px',
        position: 'relative',
        zIndex: 10
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#06b6d4',
          marginBottom: '24px',
          textShadow: '0 0 30px rgba(6,182,212,0.6)',
          animation: 'fadeIn 1s ease-out'
        }}>
          Phoenix Initializing...
        </h1>
        
        <p style={{
          fontSize: '1.25rem',
          color: 'rgba(6,182,212,0.9)',
          lineHeight: 1.8,
          fontWeight: 300,
          animation: 'fadeIn 1.5s ease-out'
        }}>
          {greeting}
        </p>

        {/* Voice wave indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '40px'
        }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{
              width: '4px',
              height: '40px',
              background: 'linear-gradient(180deg, #06b6d4 0%, rgba(6,182,212,0.3) 100%)',
              borderRadius: '2px',
              animation: `wave 1s ease-in-out infinite ${i * 0.1}s`
            }} />
          ))}
        </div>

        <div style={{
          marginTop: '24px',
          fontSize: '14px',
          color: 'rgba(6,182,212,0.6)',
          fontFamily: 'monospace',
          animation: 'fadeIn 2s ease-out'
        }}>
          Analyzing health data • Synchronizing systems • Establishing voice link
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes wave {
          0%, 100% { height: 20px; }
          50% { height: 50px; }
        }

        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
      `}</style>
    </div>
  );
}
