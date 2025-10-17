import React from 'react';
import { Flame } from 'lucide-react';

export default function PhoenixOrb({ 
  state = 'idle', // 'idle', 'processing', 'alert'
  size = 200,
  className = '' 
}) {
  const isProcessing = state === 'processing';
  const isAlert = state === 'alert';

  const colors = {
    idle: { primary: '#00d4ff', glow: 'rgba(0, 212, 255, 0.6)' },
    processing: { primary: '#ffa500', glow: 'rgba(255, 165, 0, 0.8)' },
    alert: { primary: '#ff0000', glow: 'rgba(255, 0, 0, 0.8)' }
  };

  const currentColor = colors[state] || colors.idle;

  return (
    <div 
      className={`phoenix-orb-wrapper ${className}`}
      style={{ 
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        filter: `drop-shadow(0 0 40px ${currentColor.glow})`
      }}
    >
      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes scan {
          0%, 100% { top: 0; opacity: 0; }
          50% { top: 100%; opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        .phoenix-orb-wrapper .scan-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, ${currentColor.primary}, transparent);
          animation: scan 2s ease-in-out infinite;
          opacity: ${isProcessing ? 1 : 0};
          pointer-events: none;
          z-index: 10;
        }

        .phoenix-orb-wrapper .orb-outer {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid ${currentColor.primary};
          border-radius: 50%;
          animation: rotate ${isProcessing ? '1s' : '8s'} linear infinite;
          box-shadow: ${isProcessing ? `0 0 30px ${currentColor.glow}` : 'none'};
        }

        .phoenix-orb-wrapper .orb-middle {
          position: absolute;
          top: 10%;
          left: 10%;
          width: 80%;
          height: 80%;
          border: 2px solid ${currentColor.primary};
          border-radius: 50%;
          opacity: 0.6;
          animation: rotate ${isProcessing ? '0.7s' : '6s'} linear infinite reverse;
          box-shadow: ${isProcessing ? `0 0 20px ${currentColor.glow}` : 'none'};
        }

        .phoenix-orb-wrapper .orb-inner {
          position: absolute;
          top: 20%;
          left: 20%;
          width: 60%;
          height: 60%;
          background: radial-gradient(circle, ${currentColor.glow.replace('0.8', '0.4')} 0%, transparent 70%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 60px ${currentColor.glow};
        }

        .phoenix-orb-wrapper .flame-icon {
          animation: ${isProcessing ? 'pulse 1s ease-in-out infinite' : 'none'};
          color: ${currentColor.primary};
        }
      `}</style>

      <div className="scan-line" />
      <div className="orb-outer" />
      <div className="orb-middle" />
      <div className="orb-inner">
        <div className="flame-icon">
          <Flame size={size * 0.3} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}