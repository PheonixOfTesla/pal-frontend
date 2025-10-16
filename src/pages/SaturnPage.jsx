// src/pages/SaturnPage.jsx
import React, { useState, useEffect } from 'react';
import { Clock, Target, Book, TrendingUp, Calendar } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://pal-backend-production.up.railway.app/api';

export default function SaturnPage({ userId }) {
  const [visionBoard, setVisionBoard] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [trajectory, setTrajectory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSaturnData();
  }, [userId]);

  const loadSaturnData = async () => {
    try {
      setLoading(true);
      const [visionRes, timelineRes, trajectoryRes] = await Promise.all([
        axios.get(`${API_URL}/saturn/${userId}/vision`),
        axios.get(`${API_URL}/saturn/${userId}/timeline`),
        axios.get(`${API_URL}/saturn/${userId}/trajectory`)
      ]);

      setVisionBoard(visionRes.data);
      setTimeline(timelineRes.data);
      setTrajectory(trajectoryRes.data);
    } catch (error) {
      console.error('Error loading Saturn data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#64748b' 
      }}>
        Loading your legacy...
      </div>
    );
  }

  return (
    <div style={{ 
      flex: 1, 
      overflowY: 'auto', 
      padding: '40px',
      background: '#0a0f1e' 
    }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <Clock size={32} color="#a855f7" />
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff', margin: 0 }}>
            Saturn - Legacy & Vision
          </h1>
        </div>
        <p style={{ color: '#64748b', fontSize: '16px' }}>
          Your long-term vision, life trajectory, and the legacy you're building
        </p>
      </div>

      {/* Mortality Counter */}
      {trajectory && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(139,92,246,0.1) 100%)',
          border: '1px solid rgba(168,85,247,0.2)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#a855f7', marginBottom: '16px', fontWeight: 600 }}>
            TIME REMAINING (ESTIMATED)
          </div>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>
            {trajectory.yearsRemaining} years
          </div>
          <div style={{ fontSize: '16px', color: '#64748b' }}>
            {trajectory.daysRemaining.toLocaleString()} days • {trajectory.weeksRemaining.toLocaleString()} weeks
          </div>
          <div style={{ 
            height: '8px', 
            background: 'rgba(148,163,184,0.1)', 
            borderRadius: '4px',
            marginTop: '24px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${trajectory.lifePercentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #a855f7 0%, #8b5cf6 100%)',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
            {trajectory.lifePercentage}% of estimated lifespan
          </div>
        </div>
      )}

      {/* Vision Board */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <Target size={24} color="#a855f7" />
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', margin: 0 }}>
            Vision Board
          </h2>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {visionBoard.map((item, idx) => (
            <VisionCard key={idx} vision={item} />
          ))}
        </div>
      </div>

      {/* Life Timeline */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <Calendar size={24} color="#a855f7" />
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', margin: 0 }}>
            Life Timeline
          </h2>
        </div>
        <div style={{ position: 'relative', paddingLeft: '40px' }}>
          {/* Timeline line */}
          <div style={{
            position: 'absolute',
            left: '20px',
            top: '0',
            bottom: '0',
            width: '2px',
            background: 'linear-gradient(180deg, #a855f7 0%, transparent 100%)'
          }} />

          {timeline.map((event, idx) => (
            <TimelineEvent key={idx} event={event} />
          ))}
        </div>
      </div>

      {/* Quarterly Review */}
      <div style={{
        background: 'rgba(148,163,184,0.05)',
        border: '1px solid rgba(148,163,184,0.1)',
        borderRadius: '16px',
        padding: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <Book size={24} color="#a855f7" />
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', margin: 0 }}>
            Quarterly Review
          </h2>
        </div>
        <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
          Reflect on your progress and adjust your trajectory every 90 days
        </p>
        <button style={{
          background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Start Review
        </button>
      </div>
    </div>
  );
}

function VisionCard({ vision }) {
  return (
    <div style={{
      background: 'rgba(148,163,184,0.05)',
      border: '1px solid rgba(148,163,184,0.1)',
      borderRadius: '12px',
      padding: '20px',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)';
      e.currentTarget.style.transform = 'translateY(-4px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'rgba(148,163,184,0.1)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}>
      <div style={{ 
        fontSize: '18px', 
        fontWeight: 600, 
        color: '#fff', 
        marginBottom: '8px' 
      }}>
        {vision.title}
      </div>
      <div style={{ 
        fontSize: '14px', 
        color: '#94a3b8', 
        marginBottom: '16px',
        lineHeight: '1.6'
      }}>
        {vision.description}
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <span style={{ 
          fontSize: '12px', 
          color: '#a855f7',
          padding: '4px 12px',
          background: 'rgba(168,85,247,0.1)',
          borderRadius: '12px'
        }}>
          {vision.category}
        </span>
        <span style={{ fontSize: '12px', color: '#64748b' }}>
          {vision.timeframe}
        </span>
      </div>
    </div>
  );
}

function TimelineEvent({ event }) {
  return (
    <div style={{ position: 'relative', marginBottom: '32px', paddingLeft: '20px' }}>
      {/* Dot */}
      <div style={{
        position: 'absolute',
        left: '-29px',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: event.completed ? '#a855f7' : 'rgba(148,163,184,0.3)',
        border: '3px solid #0a0f1e'
      }} />

      <div style={{
        background: 'rgba(148,163,184,0.05)',
        border: '1px solid rgba(148,163,184,0.1)',
        borderRadius: '12px',
        padding: '16px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '8px' 
        }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>
            {event.title}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {event.year}
          </div>
        </div>
        <div style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
          {event.description}
        </div>
      </div>
    </div>
  );
}