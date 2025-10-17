import React from 'react';
import { X } from 'lucide-react';

export default function PhoenixResultsOverlay({ results, isVisible, onClose }) {
  if (!isVisible || !results || results.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes cardFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .phoenix-results-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .phoenix-results-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }

        .phoenix-results-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 212, 255, 0.3);
          border-radius: 4px;
        }

        .phoenix-results-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 212, 255, 0.5);
        }
      `}</style>

      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease-out'
        }}
      />

      {/* Close Button */}
      <button 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '30px',
          right: '30px',
          background: 'rgba(255, 0, 0, 0.2)',
          border: '2px solid #ff0000',
          color: '#ff0000',
          padding: '10px 20px',
          cursor: 'pointer',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          zIndex: 1002,
          fontFamily: "'Courier New', monospace",
          transition: 'all 0.3s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 0, 0, 0.3)';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.4)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 0, 0, 0.2)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <X size={16} />
        CLOSE
      </button>

      {/* Results Container */}
      <div 
        className="phoenix-results-scrollbar"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '80vh',
          overflowY: 'auto',
          zIndex: 1001,
          padding: '20px'
        }}
      >
        {results.map((result, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(10, 14, 39, 0.95)',
              border: '2px solid #00d4ff',
              padding: '25px',
              marginBottom: '20px',
              boxShadow: '0 0 30px rgba(0, 212, 255, 0.4)',
              animation: 'cardFadeIn 0.5s ease-out forwards',
              opacity: 0,
              animationDelay: `${index * 0.1}s`,
              fontFamily: "'Courier New', monospace"
            }}
          >
            <div style={{
              fontSize: '16px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '15px',
              color: '#00ffc8'
            }}>
              {result.title}
            </div>
            <div style={{
              fontSize: '36px',
              fontWeight: 'bold',
              marginBottom: '10px',
              color: '#00d4ff'
            }}>
              {result.value}
            </div>
            <div style={{
              fontSize: '13px',
              lineHeight: 1.6,
              color: '#8b9dc3'
            }}>
              {result.description}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}