import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Calendar, Activity, Target, Moon } from 'lucide-react';

export default function PhoenixChatDrawer({ 
  isOpen, 
  onClose, 
  onQuickAction,
  onSendMessage
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'phoenix',
      content: 'Systems online. Ready to assist with health optimization, training analysis, and schedule management.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickActions = [
    { id: 'schedule', icon: Calendar, label: "Today's Schedule" },
    { id: 'recovery', icon: Activity, label: 'Recovery Status' },
    { id: 'workout', icon: Target, label: 'Workout Ready?' },
    { id: 'sleep', icon: Moon, label: 'Sleep Analysis' }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      if (onSendMessage) {
        const response = await onSendMessage(userMessage.content);
        
        const phoenixMessage = {
          id: Date.now() + 1,
          role: 'phoenix',
          content: response || 'Query processed.',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, phoenixMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'phoenix',
        content: 'Connection error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '70%',
        background: 'rgba(10, 14, 39, 0.95)',
        borderTop: '2px solid #00d4ff',
        backdropFilter: 'blur(10px)',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 -10px 50px rgba(0, 212, 255, 0.3)',
        animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: "'Courier New', monospace"
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }

        .phoenix-drawer-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .phoenix-drawer-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }

        .phoenix-drawer-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 212, 255, 0.3);
          border-radius: 4px;
        }

        .phoenix-drawer-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 212, 255, 0.5);
        }
      `}</style>

      {/* Header */}
      <div style={{
        padding: '20px 30px',
        borderBottom: '1px solid rgba(0, 212, 255, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '18px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          color: '#00d4ff'
        }}>
          Phoenix Interface
        </div>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#00d4ff',
            cursor: 'pointer',
            padding: '5px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <X size={24} />
        </button>
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        padding: '20px 30px',
        borderBottom: '1px solid rgba(0, 212, 255, 0.3)'
      }}>
        {quickActions.map(action => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onQuickAction && onQuickAction(action.id)}
              style={{
                padding: '15px 20px',
                background: 'rgba(0, 212, 255, 0.05)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                color: '#00d4ff',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 212, 255, 0.15)';
                e.currentTarget.style.borderColor = '#00d4ff';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 212, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <Icon size={18} />
              {action.label}
            </button>
          );
        })}
      </div>

      {/* Messages */}
      <div 
        className="phoenix-drawer-scrollbar"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 30px'
        }}
      >
        {messages.map(message => (
          <div 
            key={message.id}
            style={{
              marginBottom: '20px',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            <div style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '8px',
              opacity: 0.7,
              color: message.role === 'user' ? '#667eea' : '#00d4ff'
            }}>
              {message.role}
            </div>
            <div style={{
              background: message.role === 'user' 
                ? 'rgba(102, 126, 234, 0.1)' 
                : 'rgba(0, 212, 255, 0.1)',
              border: `1px solid ${message.role === 'user' 
                ? 'rgba(102, 126, 234, 0.3)' 
                : 'rgba(0, 212, 255, 0.3)'}`,
              padding: '15px 20px',
              borderRadius: '4px',
              lineHeight: 1.6,
              fontSize: '13px',
              color: message.role === 'user' ? '#667eea' : '#00d4ff'
            }}>
              {message.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '8px',
              opacity: 0.7,
              color: '#00d4ff'
            }}>
              PHOENIX
            </div>
            <div style={{
              background: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              padding: '15px 20px',
              borderRadius: '4px',
              display: 'flex',
              gap: '4px'
            }}>
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#00d4ff',
                    animation: 'typingBounce 1.4s infinite ease-in-out',
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '20px 30px',
        borderTop: '1px solid rgba(0, 212, 255, 0.3)',
        display: 'flex',
        gap: '15px'
      }}>
        <input
          type="text"
          placeholder="TYPE MESSAGE..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isTyping}
          style={{
            flex: 1,
            background: 'rgba(0, 212, 255, 0.05)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            color: '#00d4ff',
            padding: '15px 20px',
            fontSize: '13px',
            fontFamily: "'Courier New', monospace",
            outline: 'none',
            transition: 'all 0.3s'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#00d4ff';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.2)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        <button 
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isTyping}
          style={{
            width: '50px',
            background: 'linear-gradient(135deg, #00d4ff 0%, #00ffc8 100%)',
            border: 'none',
            cursor: inputValue.trim() && !isTyping ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
            opacity: inputValue.trim() && !isTyping ? 1 : 0.5,
            color: '#0a0e27'
          }}
          onMouseEnter={(e) => {
            if (inputValue.trim() && !isTyping) {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.6)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}