// src/pages/VenusPage.jsx - COMPLETE Workout & Nutrition Tracking
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Dumbbell, Plus, Calendar, TrendingUp, Flame, Apple } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { workoutService } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';

export default function VenusPage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('workouts'); // 'workouts' | 'nutrition'

  useEffect(() => {
    fetchWorkouts();
  }, [user]);

  const fetchWorkouts = async () => {
    if (!user?._id) return;
    
    setLoading(true);
    try {
      const response = await workoutService.getWorkouts(user._id, {
        limit: 10,
        sort: '-date'
      });
      
      if (response.success) {
        setWorkouts(response.workouts || []);
      } else {
        setError(response.message || 'Failed to load workouts');
      }
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError(err.message || 'Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const todaysWorkout = workouts.find(w => {
    const workoutDate = new Date(w.date).toDateString();
    return workoutDate === new Date().toDateString();
  });

  const thisWeekWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.date);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return workoutDate > weekAgo;
  });

  const completedWorkouts = workouts.filter(w => w.isCompleted);
  const totalVolume = completedWorkouts.reduce((sum, w) => 
    sum + (w.exercises?.reduce((exSum, ex) => 
      exSum + (ex.sets?.reduce((setSum, set) => 
        setSum + (set.weight * set.reps || 0), 0) || 0), 0) || 0), 0
  );

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size={64} text="Loading training data..." />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <button
          onClick={() => navigate('/jarvis')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px', marginBottom: '24px', padding: '8px' }}
        >
          <ArrowLeft size={20} />
          Back to JARVIS
        </button>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
            ♀️ Venus
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>Training & Nutrition</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '16px', marginBottom: '24px', color: '#ef4444' }}>
            {error}
          </div>
        )}

        {/* View Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          <TabButton active={view === 'workouts'} onClick={() => setView('workouts')}>
            <Dumbbell size={16} />
            Workouts
          </TabButton>
          <TabButton active={view === 'nutrition'} onClick={() => setView('nutrition')}>
            <Apple size={16} />
            Nutrition
          </TabButton>
        </div>

        {view === 'workouts' ? (
          <>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <StatCard 
                icon={<Calendar size={24} color="#f97316" />} 
                label="This Week" 
                value={thisWeekWorkouts.length} 
                unit="workouts" 
              />
              <StatCard 
                icon={<TrendingUp size={24} color="#10b981" />} 
                label="Total Volume" 
                value={Math.round(totalVolume / 1000)} 
                unit="k lbs" 
              />
              <StatCard 
                icon={<Flame size={24} color="#ef4444" />} 
                label="Completion Rate" 
                value={workouts.length > 0 ? Math.round((completedWorkouts.length / workouts.length) * 100) : 0} 
                unit="%" 
              />
            </div>

            {/* Today's Workout */}
            {todaysWorkout && (
              <div style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ color: '#f97316', fontSize: '20px', fontWeight: 'bold' }}>Today's Workout</h2>
                  {!todaysWorkout.isCompleted && (
                    <Button size="sm" onClick={() => navigate(`/workout/${todaysWorkout._id}`)}>
                      Start Workout
                    </Button>
                  )}
                </div>
                <WorkoutCard workout={todaysWorkout} isToday />
              </div>
            )}

            {/* Workout List */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#f97316', fontSize: '20px', fontWeight: 'bold' }}>Recent Workouts</h2>
              <Button icon={<Plus size={16} />} size="sm">New Workout</Button>
            </div>

            {workouts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px', background: 'rgba(148,163,184,0.05)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '12px' }}>
                <Dumbbell size={64} color="#64748b" style={{ opacity: 0.3, margin: '0 auto 16px' }} />
                <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '16px' }}>No workouts yet</p>
                <Button icon={<Plus size={16} />}>Create Your First Workout</Button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {workouts.map(workout => (
                  <WorkoutCard key={workout._id} workout={workout} />
                ))}
              </div>
            )}
          </>
        ) : (
          <NutritionView />
        )}
      </div>
    </div>
  );
}

function WorkoutCard({ workout, isToday }) {
  const totalExercises = workout.exercises?.length || 0;
  const completedExercises = workout.exercises?.filter(e => e.completed).length || 0;
  const progress = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  return (
    <div style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: '12px', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
        <div>
          <h3 style={{ color: '#f97316', fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
            {workout.name || 'Untitled Workout'}
          </h3>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>
            {new Date(workout.date).toLocaleDateString()} • {workout.type || 'General'}
          </p>
        </div>
        {workout.isCompleted && (
          <div style={{ padding: '4px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>
            COMPLETED
          </div>
        )}
      </div>

      {/* Exercise Count */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>
          {completedExercises} of {totalExercises} exercises completed
        </div>
        <div style={{ height: '6px', background: 'rgba(148,163,184,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: '#f97316', transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Exercises Preview */}
      {workout.exercises && workout.exercises.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {workout.exercises.slice(0, 3).map((exercise, idx) => (
            <div key={idx} style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: exercise.completed ? '#10b981' : '#64748b' }} />
              {exercise.name} • {exercise.sets?.length || 0} sets
            </div>
          ))}
          {workout.exercises.length > 3 && (
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              +{workout.exercises.length - 3} more exercises
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NutritionView() {
  return (
    <div style={{ textAlign: 'center', padding: '64px', background: 'rgba(148,163,184,0.05)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '12px' }}>
      <Apple size={64} color="#64748b" style={{ opacity: 0.3, margin: '0 auto 16px' }} />
      <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '16px' }}>Nutrition Tracking</h2>
      <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
        Track macros, log meals, and monitor your nutrition goals.
      </p>
      <Button icon={<Plus size={16} />}>Log Today's Meals</Button>
    </div>
  );
}

function TabButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 20px',
        background: active ? 'rgba(249,115,22,0.2)' : 'transparent',
        border: `1px solid ${active ? 'rgba(249,115,22,0.4)' : 'rgba(148,163,184,0.2)'}`,
        borderRadius: '8px',
        color: active ? '#f97316' : '#94a3b8',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: active ? 'bold' : 'normal',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
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
        <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#f97316' }}>{value}</span>
        <span style={{ fontSize: '14px', color: '#64748b', marginLeft: '8px' }}>{unit}</span>
      </div>
    </div>
  );
}
