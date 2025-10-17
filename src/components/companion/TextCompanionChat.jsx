// src/components/companion/TextCompanionChat.jsx - Text Chat with Gemini AI
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader, Flame, User } from 'lucide-react';
import { companionService } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function TextCompanionChat({ onClose }) {
  const user = useAuthStore(state => state.user);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${user?.name?.split(' ')[0] || 'there'}! I'm Phoenix, your AI companion. I have access to your health data, workouts, goals, and schedule. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await companionService.chat(input, user._id);
      
      if (response.success) {
        const assistantMessage = {
          role: 'assistant',
          content: response.response || 'I apologize, I had trouble processing that.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);

        // Optional: Speak response
        if ('speechSynthesis' in window && response.response) {
          const utterance = new SpeechSynthesisUtterance(response.response);
          utterance.rate = 0.95;
          utterance.pitch = 1.0;
          speechSynthesis.speak(utterance);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I\'m having trouble connecting. Please try again.',
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '420px',
      height: '600px',
      background: 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.95) 100%)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(6,182,212,0.3)',
      borderRadius: '20px',
      boxShadow: '0 0 60px rgba(6,182,212,0.3)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      animation: 'slideUp 0.3s ease-out'
    }}>
      
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid rgba(6,182,212,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(6,182,212,0.4)'
          }}>
            <Flame size={20} color="#fff" />
          </div>
          <div>
            <h3 style={{ color: '#06b6d4', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
              Phoenix AI
            </h3>
            <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>
              Your intelligent companion
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '4px 8px'
          }}
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              animation: 'fadeIn 0.3s ease-out'
            }}
          >
            {/* Avatar */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: msg.role === 'user' 
                ? 'rgba(148,163,184,0.2)' 
                : 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {msg.role === 'user' ? (
                <User size={16} color="#94a3b8" />
              ) : (
                <Flame size={16} color="#fff" />
              )}
            </div>

            {/* Message Content */}
            <div style={{ flex: 1 }}>
              <div style={{
                background: msg.role === 'user'
                  ? 'rgba(148,163,184,0.1)'
                  : msg.isError
                  ? 'rgba(239,68,68,0.1)'
                  : 'rgba(6,182,212,0.1)',
                border: `1px solid ${
                  msg.role === 'user'
                    ? 'rgba(148,163,184,0.2)'
                    : msg.isError
                    ? 'rgba(239,68,68,0.3)'
                    : 'rgba(6,182,212,0.3)'
                }`,
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#fff',
                fontSize: '14px',
                lineHeight: 1.6,
                wordWrap: 'break-word'
              }}>
                {msg.content}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#64748b',
                marginTop: '6px'
              }}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Flame size={16} color="#fff" />
            </div>
            <div style={{
              background: 'rgba(6,182,212,0.1)',
              border: '1px solid rgba(6,182,212,0.3)',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              gap: '6px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#06b6d4',
                animation: 'bounce 1.4s infinite ease-in-out'
              }} />
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#06b6d4',
                animation: 'bounce 1.4s infinite ease-in-out 0.2s'
              }} />
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#06b6d4',
                animation: 'bounce 1.4s infinite ease-in-out 0.4s'
              }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid rgba(6,182,212,0.2)'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end'
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Phoenix anything..."
            disabled={isLoading}
            style={{
              flex: 1,
              background: 'rgba(148,163,184,0.1)',
              border: '1px solid rgba(148,163,184,0.3)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#fff',
              fontSize: '14px',
              resize: 'none',
              minHeight: '44px',
              maxHeight: '120px',
              outline: 'none',
              fontFamily: 'inherit'
            }}
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: input.trim() && !isLoading
                ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
                : 'rgba(148,163,184,0.2)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              flexShrink: 0
            }}
          >
            {isLoading ? (
              <Loader size={20} color="#64748b" style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Send size={20} color={input.trim() ? '#fff' : '#64748b'} />
            )}
          </button>
        </div>
        <p style={{
          fontSize: '11px',
          color: '#64748b',
          marginTop: '8px',
          textAlign: 'center'
        }}>
          Phoenix has access to your health data, workouts, and goals
        </p>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}