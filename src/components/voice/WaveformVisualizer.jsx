// src/components/voice/WaveformVisualizer.jsx
import React, { useEffect, useRef } from 'react';

export default function WaveformVisualizer({ isActive, audioData }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      // Clear canvas
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      if (isActive) {
        // Draw waveform
        const barWidth = 4;
        const barGap = 2;
        const numBars = Math.floor(width / (barWidth + barGap));

        for (let i = 0; i < numBars; i++) {
          // Generate pseudo-random heights based on audio data or time
          const amplitude = audioData && audioData[i] 
            ? audioData[i] 
            : Math.sin(Date.now() * 0.01 + i * 0.5) * 0.5 + 0.5;
          
          const barHeight = amplitude * height * 0.8;
          const x = i * (barWidth + barGap);
          const y = (height - barHeight) / 2;

          // Create gradient
          const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
          gradient.addColorStop(0, '#3b82f6');
          gradient.addColorStop(0.5, '#8b5cf6');
          gradient.addColorStop(1, '#ec4899');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, barWidth, barHeight);
        }
      } else {
        // Draw idle state (flat line)
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, audioData]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={100}
      style={{
        width: '100%',
        height: '100px',
        borderRadius: '8px',
        background: '#0f172a'
      }}
    />
  );
}