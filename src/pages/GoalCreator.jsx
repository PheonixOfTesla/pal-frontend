// src/pages/GoalCreator.jsx - Create and Track Goals
import React, { useState, useEffect } from 'react';
import { Target, Plus, X, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { goalService } from '../services/api';

export default function GoalCreator() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  const [goals, setGoals] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    type: 'decrease',
    category: 'fitness',
    targetValue: '',
    currentValue: '',
    unit: 'lbs',
    deadline: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, [user]);

  const loadGoals = async () => {
    if (!user?._id) return;
    
    try {
      const response = await goalService.getGoals(user._id);
      if (response.success) {
        setGoals(response.goals || []);
      }
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async () => {
    if (!newGoal.title || !newGoal.targetValue) return;

    try {
      const response = await goalService.createGoal({
        client: user._id,
        ...newGoal,
        targetValue: parseFloat(newGoal.targetValue),
        currentValue: parseFloat(newGoal.currentValue) || 0,
        status: 'active'
      });

      if (response.success) {
        setGoals([response.goal, ...goals]);
        setNewGoal({
          title: '',
          description: '',
          type: 'decrease',
          category: 'fitness',
          targetValue: '',
          currentValue: '',
          unit: 'lbs',
          deadline: ''
        });
        setShowCreate(false);
      }
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  const updateProgress = async (goalId, newProgress) => {
    try {
      const response = await goalService.updateProgress(goalId, newProgress);
      
      if (response.success) {
        setGoals(goals.map(g => 
          g._id === goalId ? { ...g, currentValue: newProgress } : g
        ));
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const calculateProgress = (goal) => {
    if (goal.type === 'decrease') {
      const total = goal.currentValue - goal.targetValue;
      const progress = goal.currentValue - goal.targetValue;
      return total > 0 ? ((progress / total) * 100) : 0;
    } else {
      const total = goal.targetValue - goal.currentValue;
      const progress = goal.targetValue - goal.currentValue;
      return total > 0 ? ((progress / total) * 100) : 0;
    }
  };

  const GoalCard = ({ goal }) => {
    const progress = calculateProgress(goal);
    const isComplete = goal.status === 'completed';
    const daysRemaining = goal.deadline 
      ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
      : null;

    const categoryColors = {
      fitness: '#06b6d4',
      health: '#10b981',
      performance: '#f97316',
      body_composition: '#ef4444',
      lifestyle: '#8b5cf6'
    };

    const color = categoryColors[goal.category] || '#06b6d4';

    return (
      <div style={{
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '16px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              {isComplete && <CheckCircle size={20} color="#10b981" />}
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: isComplete ? '#10b981' : '#fff'
              }}>
                {goal.title}
              </h3>
            </div>
            
            {goal.description && (
              <p style={{
                fontSize: '14px',
                color: '#94a3b8',
                marginBottom: '12px'
              }}>
                {goal.description}
              </p>
            )}

            <div style={{
              display: 'inline-block',
              padding: '4px 12px',
              background: `${color}20`,
              borderRadius: '12px',
              fontSize: '12px',
              color,
              fontWeight: 600
            }}>
              {goal.category.replace('_', ' ').toUpperCase()}
            </div>
          </div>

          {daysRemaining !== null && (
            <div style={{
              textAlign: 'right',
              fontSize: '12px',
              color: daysRemaining < 7 ? '#ef4444' : '#94a3b8'
            }}>
              <Calendar size={16} style={{ marginBottom: '4px' }} />
              <div>{daysRemaining} days</div>
            </div>
          )}
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '14px',
            color: '#94a3b8'
          }}>
            <span>Progress</span>
            <span style={{ fontWeight: 'bold', color }}>
              {Math.round(progress)}%
            </span>
          </div>

          <div style={{
            height: '8px',
            background: 'rgba(148,163,184,0.2)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              background: isComplete ? '#10b981' : color,
              width: `${Math.min(progress, 100)}%`,
              transition: 'width 0.3s'
            }} />
          </div>
        </div>

        {/* Values */}
        <div style={{
          display: 'flex',
          gap: '24px',
          fontSize: '14px'
        }}>
          <div>
            <div style={{ color: '#94a3b8', marginBottom: '4px' }}>Current</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
              {goal.currentValue} {goal.unit}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            color: '#94a3b8'
          }}>
            <TrendingUp size={20} />
          </div>

          <div>
            <div style={{ color: '#94a3b8', marginBottom: '4px' }}>Target</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color }}>
              {goal.targetValue} {goal.unit}
            </div>
          </div>
        </div>

        {/* Quick Update */}
        {!isComplete && (
          <div style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(148,163,184,0.2)',
            display: 'flex',
            gap: '8px'
          }}>
            <input
              type="number"
              step="0.1"
              placeholder="Update progress"
              style={{
                flex: 1,
                padding: '10px 16px',
                background: 'rgba(0,0,0,0.5)',
                border: `1px solid ${color}30`,
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px'
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value) {
                  updateProgress(goal._id, parseFloat(e.target.value));
                  e.target.value = '';
                }
              }}
            />
            <button
              style={{
                padding: '10px 20px',
                background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              onClick={(e) => {
                const input = e.target.previousSibling;
                if (input.value) {
                  updateProgress(goal._id, parseFloat(input.value));
                  input.value = '';
                }
              }}
            >
              Update
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ef4444'
      }}>
        <Target className="animate-pulse" size={48} />
      </div>
    );
  }

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
        backgroundImage: 'linear-gradient(#ef4444 1px, transparent 1px), linear-gradient(90deg, #ef4444 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative'
      }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Target size={36} />
            Goals
          </h1>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowCreate(true)}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Plus size={16} />
              New Goal
            </button>

            <button
              onClick={() => navigate('/jarvis')}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(148,163,184,0.2)',
                border: '1px solid rgba(148,163,184,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#94a3b8'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Goals List */}
        {goals.length === 0 ? (
          <div style={{
            background: 'rgba(239,68,68,0.05)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '16px',
            padding: '64px',
            textAlign: 'center',
            color: '#94a3b8'
          }}>
            <Target size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>No goals yet</p>
            <p style={{ fontSize: '14px' }}>Create your first goal to start tracking progress</p>
          </div>
        ) : (
          <div>
            {goals.map(goal => (
              <GoalCard key={goal._id} goal={goal} />
            ))}
          </div>
        )}

        {/* Create Goal Modal */}
        {showCreate && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '24px'
          }}>
            <div style={{
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(220,38,38,0.05) 100%)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '16px',
              padding: '32px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#ef4444',
                marginBottom: '24px'
              }}>
                Create New Goal
              </h2>

              <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '12px',
                    color: '#94a3b8',
                    fontWeight: 600
                  }}>
                    GOAL TITLE
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Lose 20 pounds"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '16px'
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
                    DESCRIPTION (OPTIONAL)
                  </label>
                  <textarea
                    placeholder="Why is this goal important?"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '16px',
                    fontWeight: 600,
                    cursor: newGoal.title && newGoal.targetValue ? 'pointer' : 'not-allowed'
                  }}
                >
                  Create Goal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '12px',
                      color: '#94a3b8',
                      fontWeight: 600
                    }}>
                      CATEGORY
                    </label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '16px',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '16px'
                      }}
                    >
                      <option value="fitness">Fitness</option>
                      <option value="health">Health</option>
                      <option value="performance">Performance</option>
                      <option value="body_composition">Body Composition</option>
                      <option value="lifestyle">Lifestyle</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '12px',
                      color: '#94a3b8',
                      fontWeight: 600
                    }}>
                      TYPE
                    </label>
                    <select
                      value={newGoal.type}
                      onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '16px',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '16px'
                      }}
                    >
                      <option value="decrease">Decrease</option>
                      <option value="increase">Increase</option>
                      <option value="maintain">Maintain</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '12px',
                      color: '#94a3b8',
                      fontWeight: 600
                    }}>
                      CURRENT VALUE
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0"
                      value={newGoal.currentValue}
                      onChange={(e) => setNewGoal({ ...newGoal, currentValue: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '16px',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '16px'
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
                      TARGET VALUE
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0"
                      value={newGoal.targetValue}
                      onChange={(e) => setNewGoal({ ...newGoal, targetValue: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '16px',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '16px'
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
                      UNIT
                    </label>
                    <select
                      value={newGoal.unit}
                      onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '16px',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '16px'
                      }}
                    >
                      <option value="lbs">lbs</option>
                      <option value="kg">kg</option>
                      <option value="%">%</option>
                      <option value="reps">reps</option>
                      <option value="min">minutes</option>
                      <option value="miles">miles</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '12px',
                    color: '#94a3b8',
                    fontWeight: 600
                  }}>
                    DEADLINE (OPTIONAL)
                  </label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowCreate(false)}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: 'rgba(148,163,184,0.2)',
                    border: '1px solid rgba(148,163,184,0.3)',
                    borderRadius: '8px',
                    color: '#94a3b8',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={createGoal}
                  disabled={!newGoal.title || !newGoal.targetValue}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: newGoal.title && newGoal.targetValue
                      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                      : 'rgba(148,163,184,0.2)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '16px',
                