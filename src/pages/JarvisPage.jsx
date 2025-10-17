import React, { useState, useEffect } from 'react';
import { MessageSquare, Mic } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { phoenixService } from '../services/phoenixService';
import PhoenixOrb from '../components/phoenix/PhoenixOrb';
import PhoenixChatDrawer from '../components/phoenix/PhoenixChatDrawer';
import PhoenixResultsOverlay from '../components/phoenix/PhoenixResultsOverlay';

export default function JarvisPage() {
  const user = useAuthStore(state => state.user);
  const { setLoading } = useDataStore();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [orbState, setOrbState] = useState('idle');
  const [statusText, setStatusText] = useState('READY');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [resultsData, setResultsData] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle quick action from drawer
  const handleQuickAction = async (actionType) => {
    setIsDrawerOpen(false);
    setOrbState('processing');
    setStatusText('ANALYZING...');

    try {
      let response;
      
      switch (actionType) {
        case 'recovery':
          response = await phoenixService.getRecoveryStatus(user._id);
          break;
        case 'schedule':
          response = await phoenixService.getTodaySchedule(user._id);
          break;
        case 'workout':
          response = await phoenixService.getWorkoutReadiness(user._id);
          break;
        case 'sleep':
          response = await phoenixService.getSleepAnalysis(user._id);
          break;
        default:
          break;
      }

      if (response && response.success) {
        // Format data for results overlay
        setResultsData(phoenixService.formatResultsData(response.data, actionType));
        setShowResults(true);
      }
    } catch (error) {
      console.error('Quick action error:', error);
      setOrbState('alert');
      setStatusText('ERROR');
      setTimeout(() => {
        setOrbState('idle');
        setStatusText('READY');
      }, 2000);
    } finally {
      if (orbState !== 'alert') {
        setOrbState('idle');
        setStatusText('READY');
      }
    }
  };

  // Handle message from chat drawer
  const handleSendMessage = async (message) => {
    try {
      const response = await phoenixService.sendMessage(message, user._id);
      return response.data?.message || 'Query processed.';
    } catch (error) {
      console.error('Message error:', error);
      throw error;
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setResultsData(null);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Animated grid background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
        animation: 'gridMove 20s linear infinite'
      }} />

      {/* Radial glow from orb */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: orbState === 'alert' 
          ? 'radial-gradient(circle, rgba(255,0,0,0.15) 0%, transparent 70%)'
          : orbState === 'processing'
          ? 'radial-gradient(circle, rgba(255,165,0,0.15) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
        transition: 'all 0.5s ease'
      }} />

      {/* Time display */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '30px',
        fontSize: '14px',
        color: '#00d4ff',
        letterSpacing: '2px',
        fontFamily: "'Courier New', monospace",
        zIndex: 10
      }}>
        {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        padding: '40px'
      }}>
        
        {/* Status */}
        <div style={{
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div style={{
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            color: orbState === 'processing' 
              ? '#ffa500' 
              : orbState === 'alert'
              ? '#ff0000'
              : '#00d4ff',
            textShadow: orbState === 'processing'
              ? '0 0 10px rgba(255,165,0,0.8)'
              : orbState === 'alert'
              ? '0 0 10px rgba(255,0,0,0.8)'
              : '0 0 10px rgba(0,212,255,0.8)',
            fontFamily: "'Courier New', monospace",
            animation: orbState === 'processing' ? 'pulseText 1s ease-in-out infinite' : 'none'
          }}>
            {statusText}
          </div>
        </div>

        {/* Phoenix Orb */}
        <div style={{ marginBottom: '40px' }}>
          <PhoenixOrb state={orbState} size={200} />
        </div>

        {/* Greeting */}
        <h1 style={{
          fontSize: '36px',
          fontWeight: '300',
          marginBottom: '15px',
          textAlign: 'center',
          color: '#00d4ff',
          textShadow: '0 0 20px rgba(0,212,255,0.6)',
          letterSpacing: '2px',
          fontFamily: "'Courier New', monospace"
        }}>
          Hello, {user?.name?.split(' ')[0] || 'Phoenix'}
        </h1>

        {/* Subtitle */}
        <p style={{
          color: '#8b9dc3',
          fontSize: '13px',
          textAlign: 'center',
          maxWidth: '600px',
          lineHeight: 1.6,
          fontFamily: "'Courier New', monospace",
          marginBottom: '40px'
        }}>
          Ask me anything about your health, training, schedule, goals, or finances.
        </p>

        {/* Voice Button (disabled for now) */}
        <button
          disabled
          style={{
            marginTop: '20px',
            padding: '16px 40px',
            background: 'rgba(0,212,255,0.1)',
            border: '2px solid rgba(0,212,255,0.3)',
            color: '#00d4ff',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            cursor: 'not-allowed',
            position: 'relative',
            overflow: 'hidden',
            opacity: 0.4,
            fontFamily: "'Courier New', monospace",
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <Mic size={18} />
          Hold to talk to Phoenix
        </button>
      </div>

      {/* Chat Toggle Button */}
      <button
        onClick={toggleDrawer}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #00d4ff 0%, #00ffc8 100%)',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 5px 30px rgba(0,212,255,0.5)',
          zIndex: 1000,
          transition: 'all 0.3s',
          color: '#0a0e27'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 5px 40px rgba(0,212,255,0.8)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 5px 30px rgba(0,212,255,0.5)';
        }}
      >
        <MessageSquare size={28} />
      </button>

      {/* Phoenix Chat Drawer */}
      <PhoenixChatDrawer
        isOpen={isDrawerOpen}
        onClose={toggleDrawer}
        onQuickAction={handleQuickAction}
        onSendMessage={handleSendMessage}
      />

      {/* Results Overlay */}
      <PhoenixResultsOverlay
        results={resultsData}
        isVisible={showResults}
        onClose={handleCloseResults}
      />

      <style>{`
        @keyframes pulseText {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
      `}</style>
    </div>
  );
}