import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Plus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { calendarService } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';

export default function EarthPage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user?._id) return;
      
      setLoading(true);
      try {
        const response = await calendarService.getEvents(user._id);
        
        if (response.success) {
          setEvents(response.events || []);
        } else {
          setError(response.message || 'Failed to load events');
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  const todaysEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.toDateString() === new Date().toDateString();
  });

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size={64} text="Loading calendar..." />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={() => navigate('/jarvis')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px', marginBottom: '24px', padding: '8px' }}
        >
          <ArrowLeft size={20} />
          Back to JARVIS
        </button>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
            🌍 Earth
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>Calendar & Time Management</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '16px', marginBottom: '24px', color: '#ef4444' }}>
            {error}
          </div>
        )}

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <StatCard icon={<Calendar size={24} color="#3b82f6" />} label="Today's Events" value={todaysEvents.length} unit="scheduled" />
          <StatCard icon={<Clock size={24} color="#10b981" />} label="This Week" value={events.length} unit="events" />
        </div>

        {/* Today's Schedule */}
        <div style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#3b82f6', fontSize: '20px', fontWeight: 'bold' }}>Today's Schedule</h2>
            <Button icon={<Plus size={16} />} size="sm">Add Event</Button>
          </div>

          {todaysEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p>No events scheduled for today</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {todaysEvents.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }) {
  const startTime = new Date(event.start);
  const endTime = new Date(event.end);
  
  return (
    <div style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.3)', borderLeft: '3px solid #3b82f6', borderRadius: '8px', padding: '16px' }}>
      <div style={{ color: '#3b82f6', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
        {startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - {endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
      </div>
      <div style={{ color: '#fff', fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>
        {event.title}
      </div>
      {event.location && (
        <div style={{ color: '#94a3b8', fontSize: '14px' }}>📍 {event.location}</div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, unit }) {
  return (
    <div style={{ background: 'rgba(148,163,184,0.05)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '12px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        {icon}
        <span style={{ color: '#94a3b8', fontSize: '14px' }}>{label}</span>
      </div>
      <div>
        <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>{value}</span>
        <span style={{ fontSize: '14px', color: '#64748b', marginLeft: '8px' }}>{unit}</span>
      </div>
    </div>
  );
}