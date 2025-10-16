import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, TrendingUp, CheckCircle, Circle, Plus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { goalService } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';

export default function MarsPage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    const fetchGoals = async () => {
      if (!user?._id) return;
      
      setLoading(true);
      try {
        const response = await goalService.getGoals(user._id);
        
        if (response.success) {
          setGoals(response.goals || []);
        } else {
          setError(response.message || 'Failed to load goals');
        }
      } catch (err) {
        console.error('Error fetching goals:', err);
        setError(err.message || 'Failed to load goals');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [user]);

  const filteredGoals = goals.filter(goal => {
    if (filter === 'active') return goal.status === 'active';
    if (filter === 'completed') return goal.status === 'completed';
    return true;
  });

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');
  const avgProgress = activeGoals.length > 0 
    ? Math.round(activeGoals.reduce((sum, g) => sum + (g.progress || 0), 0) / activeGoals.length)
    : 0;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size={64} text="Loading goals..." />
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
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
            ♂️ Mars
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>Goals & Execution</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '16px', marginBottom: '24px', color: '#ef4444' }}>
            {error}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <StatCard icon={<Target size={24} color="#ef4444" />} label="Active Goals" value={activeGoals.length} unit="in progress" />
          <StatCard icon={<CheckCircle size={24} color="#10b981" />} label="Completed" value={completedGoals.length} unit="achieved" />
          <StatCard icon={<TrendingUp size={24} color="#f59e0b" />} label="Avg Progress" value={avgProgress} unit="%" />
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <TabButton active={filter === 'active'} onClick={() => setFilter('active')}>Active</TabButton>
          <TabButton active={filter === 'completed'} onClick={() => setFilter('completed')}>Completed</TabButton>
          <TabButton active={filter === 'all'} onClick={() => setFilter('all')}>All</TabButton>
        </div>

        {/* Goals List */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#ef4444', fontSize: '20px', fontWeight: 'bold' }}>Your Goals</h2>
          <Button icon={<Plus size={16} />} size="sm">New Goal</Button>
        </div>

        {filteredGoals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', background: 'rgba(148,163,184,0.05)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '12px' }}>
            <Target size={64} color="#64748b" style={{ opacity: 0.3, margin: '0 auto 16px' }} />
            <p style={{ color: '#64748b', fontSize: '16px' }}>No {filter} goals yet</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {filteredGoals.map(goal => (
              <GoalCard key={goal._id} goal={goal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GoalCard({ goal }) {
  const progress = goal.progress || 0;
  const daysLeft = goal.deadline ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;
  
  const getStatusColor = () => {
    if (goal.status === 'completed') return '#10b981';
    if (progress >= 75) return '#10b981';
    if (progress >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            {goal.status === 'completed' ? (
              <CheckCircle size={24} color="#10b981" />
            ) : (
              <Circle size={24} color="#ef4444" />
            )}
            <h3 style={{ color: '#ef4444', fontSize: '20px', fontWeight: 'bold' }}>{goal.title}</h3>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>{goal.description}</p>
        </div>
        
        {daysLeft !== null && goal.status !== 'completed' && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: daysLeft < 7 ? '#ef4444' : '#94a3b8' }}>
              {daysLeft}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>days left</div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Progress</span>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: getStatusColor() }}>{progress}%</span>
        </div>
        <div style={{ height: '8px', background: 'rgba(148,163,184,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: getStatusColor(), transition: 'width 0.3s' }} />
        </div>
      </div>
    </div>
  );
}

function TabButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        background: active ? 'rgba(239,68,68,0.2)' : 'transparent',
        border: `1px solid ${active ? 'rgba(239,68,68,0.4)' : 'rgba(148,163,184,0.2)'}`,
        borderRadius: '6px',
        color: active ? '#ef4444' : '#94a3b8',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: active ? 'bold' : 'normal',
        transition: 'all 0.2s'
      }}
    >
      {children}
    </button>
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
        <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444' }}>{value}</span>
        <span style={{ fontSize: '14px', color: '#64748b', marginLeft: '8px' }}>{unit}</span>
      </div>
    </div>
  );
}