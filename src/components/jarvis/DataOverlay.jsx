// src/components/jarvis/DataOverlay.jsx - Floating Holographic Data
import React, { useEffect } from 'react';
import { X, Activity, Dumbbell, Calendar, Target, TrendingUp, Heart } from 'lucide-react';
import RecoveryScore from '../mercury/RecoveryScore';
import HRVChart from '../mercury/HRVChart';
import SleepAnalysis from '../mercury/SleepAnalysis';

export default function DataOverlay({ type, data, onClose }) {
  // Auto-close after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 30000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const renderContent = () => {
    switch (type) {
      case 'recovery':
        return (
          <div style={{ display: 'grid', gap: '24px' }}>
            <RecoveryScore
              score={data?.recoveryScore || 0}
              trend={data?.trend}
              components={data?.components}
              recommendation={data?.recommendation}
            />
            
            {data?.hrvData && (
              <HRVChart
                data={data.hrvData}
                baseline={data.hrvBaseline}
              />
            )}
          </div>
        );

      case 'sleep':
        return (
          <SleepAnalysis sleepData={data} />
        );

      case 'workouts':
        return (
          <div style={{ display: 'grid', gap: '16px' }}>
            <h2 style={{ color: '#f97316', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
              <Dumbbell size={28} style={{ display: 'inline', marginRight: '12px', verticalAlign: 'middle' }} />
              Your Workouts
            </h2>
            {data?.workouts?.length > 0 ? (
              data.workouts.map(workout => (
                <WorkoutCard key={workout._id} workout={workout} />
              ))
            ) : (
              <p style={{ color: '#64748b', padding: '40px', textAlign: 'center' }}>
                No workouts scheduled
              </p>
            )}
          </div>
        );

      case 'calendar':
        return (
          <div style={{ display: 'grid', gap: '16px' }}>
            <h2 style={{ color: '#3b82f6', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
              <Calendar size={28} style={{ display: 'inline', marginRight: '12px', verticalAlign: 'middle' }} />
              Today's Schedule
            </h2>
            {data?.events?.length > 0 ? (
              data.events.map(event => (
                <EventCard key={event._id} event={event} />
              ))
            ) : (
              <p style={{ color: '#64748b', padding: '40px', textAlign: 'center' }}>
                No events today
              </p>
            )}
          </div>
        );

      case 'goals':
        return (
          <div style={{ display: 'grid', gap: '16px' }}>
            <h2 style={{ color: '#ef4444', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
              <Target size={28} style={{ display: 'inline', marginRight: '12px', verticalAlign: 'middle' }} />
              Active Goals
            </h2>
            {data?.goals?.length > 0 ? (
              data.goals.map(goal => (
                <GoalCard key={goal._id} goal={goal} />
              ))
            ) : (
              <p style={{ color: '#64748b', padding: '40px', textAlign: 'center' }}>
                No active goals
              </p>
            )}
          </div>
        );

      case 'stats':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <StatCard icon={<Activity size={32} />} label="Steps Today" value={data?.steps || 0} color="#06b6d4" />
            <StatCard icon={<Heart size={32} />} label="Resting HR" value={`${data?.restingHR || 0} bpm`} color="#ef4444" />
            <StatCard icon={<TrendingUp size={32} />} label="Recovery Score" value={`${data?.recoveryScore || 0}%`} color="#10b981" />
            <StatCard icon={<Dumbbell size={32} />} label="Workouts This Week" value={data?.workoutsThisWeek || 0} color="#f97316" />
          </div>
        );

      default:
        return <p style={{ color: '#64748b' }}>No data available</p>;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      
      {/* Backdrop blur */}
      <div 
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(10px)'
        }} 
      />

      {/* Overlay Card */}
      <div style={{
        position: 'relative',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto',
        background: 'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(8,145,178,0.05) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(6,182,212,0.3)',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: '0 0 60px rgba(6,182,212,0.3), inset 0 0 60px rgba(6,182,212,0.05)',
        animation: 'slideUp 0.4s ease-out'
      }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(148,163,184,0.2)',
            border: '1px solid rgba(148,163,184,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#94a3b8',
            transition: 'all 0.2s',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(148,163,184,0.3)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(148,163,184,0.2)';
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          <X size={20} />
        </button>

        {/* Content */}
        {renderContent()}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// Helper Components

function WorkoutCard({ workout }) {
  return (
    <div style={{
      background: 'rgba(249,115,22,0.1)',
      border: '1px solid rgba(249,115,22,0.3)',
      borderRadius: '12px',
      padding: '20px'
    }}>
      <h3 style={{ color: '#f97316', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
        {workout.name || 'Workout'}
      </h3>
      <p style={{ color: '#94a3b8', fontSize: '14px' }}>
        {new Date(workout.date).toLocaleDateString()} • {workout.exercises?.length || 0} exercises
      </p>
    </div>
  );
}

function EventCard({ event }) {
  return (
    <div style={{
      background: 'rgba(59,130,246,0.1)',
      border: '1px solid rgba(59,130,246,0.3)',
      borderRadius: '12px',
      padding: '20px'
    }}>
      <div style={{ color: '#3b82f6', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
        {new Date(event.start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
      </div>
      <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
        {event.title}
      </h3>
      {event.location && (
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>📍 {event.location}</p>
      )}
    </div>
  );
}

function GoalCard({ goal }) {
  const progress = goal.progress || 0;
  
  return (
    <div style={{
      background: 'rgba(239,68,68,0.1)',
      border: '1px solid rgba(239,68,68,0.3)',
      borderRadius: '12px',
      padding: '20px'
    }}>
      <h3 style={{ color: '#ef4444', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
        {goal.title}
      </h3>
      <div style={{ height: '8px', background: 'rgba(148,163,184,0.2)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: '#ef4444', transition: 'width 0.3s' }} />
      </div>
      <p style={{ color: '#94a3b8', fontSize: '14px' }}>{progress}% complete</p>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: 'rgba(148,163,184,0.05)',
      border: '1px solid rgba(148,163,184,0.2)',
      borderRadius: '12px',
      padding: '24px',
      textAlign: 'center'
    }}>
      <div style={{ color, marginBottom: '12px' }}>{icon}</div>
      <div style={{ fontSize: '32px', fontWeight: 'bold', color, marginBottom: '8px' }}>
        {value}
      </div>
      <div style={{ fontSize: '14px', color: '#94a3b8' }}>{label}</div>
    </div>
  );
}