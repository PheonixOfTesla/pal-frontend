// src/pages/WorkoutLogger.jsx - Real-time Workout Tracking
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Dumbbell, Check, X, Plus, Clock, TrendingUp } from 'lucide-react';
import { workoutService } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function WorkoutLogger() {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  const [workout, setWorkout] = useState(null);
  const [activeExercise, setActiveExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState({ reps: '', weight: '' });
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load workout
  useEffect(() => {
    const loadWorkout = async () => {
      if (!workoutId) return;
      
      try {
        const response = await workoutService.getWorkout(workoutId);
        if (response.success) {
          setWorkout(response.workout);
        }
      } catch (error) {
        console.error('Failed to load workout:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [workoutId]);

  // Timer
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const logSet = async () => {
    if (!currentSet.reps || !currentSet.weight) return;

    try {
      const exercise = workout.exercises[activeExercise];
      
      const response = await workoutService.logSet(workoutId, {
        exerciseId: exercise.exerciseId._id,
        reps: parseInt(currentSet.reps),
        weight: parseFloat(currentSet.weight),
        setNumber: exercise.completedSets.length + 1
      });

      if (response.success) {
        // Update local state
        const updatedWorkout = { ...workout };
        updatedWorkout.exercises[activeExercise].completedSets.push({
          reps: parseInt(currentSet.reps),
          weight: parseFloat(currentSet.weight),
          timestamp: new Date()
        });
        setWorkout(updatedWorkout);
        
        // Reset form
        setCurrentSet({ reps: '', weight: '' });
        
        // Start rest timer
        setTimer(0);
        setIsTimerRunning(true);

        // Auto-advance if all sets complete
        const completedSets = updatedWorkout.exercises[activeExercise].completedSets.length;
        if (completedSets >= exercise.sets) {
          setTimeout(() => {
            if (activeExercise < workout.exercises.length - 1) {
              setActiveExercise(activeExercise + 1);
            }
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Failed to log set:', error);
    }
  };

  const completeWorkout = async () => {
    try {
      const response = await workoutService.completeWorkout(workoutId, {
        duration: timer,
        notes: 'Completed via workout logger'
      });

      if (response.success) {
        navigate('/jarvis');
      }
    } catch (error) {
      console.error('Failed to complete workout:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#06b6d4'
      }}>
        <Dumbbell className="animate-pulse" size={48} />
      </div>
    );
  }

  if (!workout) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <p style={{ color: '#ef4444', marginBottom: '24px' }}>Workout not found</p>
        <button
          onClick={() => navigate('/jarvis')}
          style={{
            padding: '12px 24px',
            background: '#06b6d4',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          Back to Phoenix
        </button>
      </div>
    );
  }

  const currentExercise = workout.exercises[activeExercise];
  const completedSets = currentExercise.completedSets?.length || 0;
  const totalSets = currentExercise.sets;
  const isExerciseComplete = completedSets >= totalSets;
  const isWorkoutComplete = workout.exercises.every((ex, idx) => {
    const completed = ex.completedSets?.length || 0;
    return completed >= ex.sets;
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      padding: '24px',
      position: 'relative'
    }}>
      
      {/* Grid background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        opacity: 0.05,
        backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        position: 'relative'
      }}>
        
        {/* Workout Title */}
        <div style={{
          background: 'rgba(6,182,212,0.1)',
          border: '1px solid rgba(6,182,212,0.3)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#06b6d4',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Dumbbell size={28} />
              {workout.name}
            </h1>
            
            <button
              onClick={() => navigate('/jarvis')}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(239,68,68,0.2)',
                border: '1px solid rgba(239,68,68,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#ef4444'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Timer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#06b6d4',
            fontSize: '14px'
          }}>
            <Clock size={16} />
            <span>{formatTime(timer)}</span>
            {isTimerRunning && <span style={{ color: '#10b981' }}>• Rest</span>}
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          background: 'rgba(148,163,184,0.2)',
          height: '8px',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '32px'
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #06b6d4, #0891b2)',
            width: `${(activeExercise / workout.exercises.length) * 100}%`,
            transition: 'width 0.3s'
          }} />
        </div>

        {/* Exercise Navigation */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          marginBottom: '24px',
          padding: '4px'
        }}>
          {workout.exercises.map((ex, idx) => {
            const exCompleted = (ex.completedSets?.length || 0) >= ex.sets;
            return (
              <button
                key={idx}
                onClick={() => setActiveExercise(idx)}
                style={{
                  minWidth: '80px',
                  padding: '12px 16px',
                  background: idx === activeExercise 
                    ? 'rgba(6,182,212,0.2)' 
                    : exCompleted 
                    ? 'rgba(16,185,129,0.1)'
                    : 'rgba(148,163,184,0.1)',
                  border: idx === activeExercise 
                    ? '2px solid #06b6d4' 
                    : exCompleted
                    ? '1px solid rgba(16,185,129,0.3)'
                    : '1px solid rgba(148,163,184,0.3)',
                  borderRadius: '8px',
                  color: idx === activeExercise ? '#06b6d4' : exCompleted ? '#10b981' : '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                {exCompleted && (
                  <Check 
                    size={12} 
                    style={{ 
                      position: 'absolute', 
                      top: '4px', 
                      right: '4px',
                      color: '#10b981'
                    }} 
                  />
                )}
                {ex.exerciseId.name.split(' ').slice(0, 2).join(' ')}
              </button>
            );
          })}
        </div>

        {/* Current Exercise */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(8,145,178,0.05) 100%)',
          border: '1px solid rgba(6,182,212,0.3)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: '12px'
          }}>
            {currentExercise.exerciseId.name}
          </h2>

          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '24px',
            color: '#94a3b8',
            fontSize: '14px'
          }}>
            <div>
              <span style={{ color: '#06b6d4' }}>{completedSets}</span>
              /{totalSets} sets
            </div>
            <div>•</div>
            <div>{currentExercise.reps} reps</div>
          </div>

          {/* Set Input */}
          {!isExerciseComplete && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '12px',
                  color: '#94a3b8',
                  fontWeight: 600
                }}>
                  REPS
                </label>
                <input
                  type="number"
                  value={currentSet.reps}
                  onChange={(e) => setCurrentSet({ ...currentSet, reps: e.target.value })}
                  placeholder={currentExercise.reps.toString()}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(6,182,212,0.3)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '12px',
                  color: '#94a3b8',
                  fontWeight: 600
                }}>
                  WEIGHT (LBS)
                </label>
                <input
                  type="number"
                  step="2.5"
                  value={currentSet.weight}
                  onChange={(e) => setCurrentSet({ ...currentSet, weight: e.target.value })}
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(6,182,212,0.3)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}
                />
              </div>
            </div>
          )}

          {/* Log Set Button */}
          {!isExerciseComplete && (
            <button
              onClick={logSet}
              disabled={!currentSet.reps || !currentSet.weight}
              style={{
                width: '100%',
                padding: '20px',
                background: currentSet.reps && currentSet.weight
                  ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
                  : 'rgba(148,163,184,0.2)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: currentSet.reps && currentSet.weight ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: currentSet.reps && currentSet.weight
                  ? '0 4px 20px rgba(6,182,212,0.4)'
                  : 'none'
              }}
            >
              <Plus size={24} />
              Log Set {completedSets + 1}
            </button>
          )}

          {/* Exercise Complete */}
          {isExerciseComplete && (
            <div style={{
              textAlign: 'center',
              padding: '32px',
              color: '#10b981'
            }}>
              <Check size={48} style={{ marginBottom: '16px' }} />
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                Exercise Complete!
              </div>
            </div>
          )}

          {/* Completed Sets */}
          {completedSets > 0 && (
            <div style={{ marginTop: '24px' }}>
              <div style={{
                fontSize: '12px',
                color: '#94a3b8',
                fontWeight: 600,
                marginBottom: '12px'
              }}>
                COMPLETED SETS
              </div>
              {currentExercise.completedSets.map((set, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    color: '#10b981',
                    fontSize: '14px'
                  }}
                >
                  <span>Set {idx + 1}</span>
                  <span>{set.reps} reps × {set.weight} lbs</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Complete Workout */}
        {isWorkoutComplete && (
          <button
            onClick={completeWorkout}
            style={{
              width: '100%',
              padding: '24px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: '0 4px 24px rgba(16,185,129,0.4)'
            }}
          >
            <Check size={28} />
            Complete Workout
          </button>
        )}
      </div>
    </div>
  );
}
