// src/pages/NutritionTracker.jsx - Daily Meal & Macro Tracking
import React, { useState, useEffect } from 'react';
import { Apple, Plus, X, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

export default function NutritionTracker() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [todaysMeals, setTodaysMeals] = useState([]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNutritionData();
  }, [user]);

  const loadNutritionData = async () => {
    if (!user?._id) return;
    
    try {
      // Load nutrition plan
      const planResponse = await api.get(`/nutrition/client/${user._id}`);
      if (planResponse.data.success && planResponse.data.nutritionPlans?.[0]) {
        setNutritionPlan(planResponse.data.nutritionPlans[0]);
      }

      // Load today's meals (would need meals endpoint)
      // For now, use state only
      setTodaysMeals([]);
    } catch (error) {
      console.error('Failed to load nutrition data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMeal = () => {
    const meal = {
      id: Date.now(),
      ...newMeal,
      calories: parseFloat(newMeal.calories) || 0,
      protein: parseFloat(newMeal.protein) || 0,
      carbs: parseFloat(newMeal.carbs) || 0,
      fat: parseFloat(newMeal.fat) || 0,
      timestamp: new Date()
    };

    setTodaysMeals([...todaysMeals, meal]);
    setNewMeal({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    setShowAddMeal(false);
  };

  const removeMeal = (mealId) => {
    setTodaysMeals(todaysMeals.filter(m => m.id !== mealId));
  };

  // Calculate totals
  const totals = todaysMeals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const goals = nutritionPlan ? {
    calories: nutritionPlan.calorieTarget,
    protein: nutritionPlan.proteinTarget,
    carbs: nutritionPlan.carbsTarget,
    fat: nutritionPlan.fatTarget
  } : { calories: 2000, protein: 150, carbs: 200, fat: 65 };

  const MacroCard = ({ label, current, goal, color, unit = 'g' }) => {
    const percentage = goal > 0 ? (current / goal) * 100 : 0;
    const isOver = percentage > 100;

    return (
      <div style={{
        background: 'rgba(148,163,184,0.05)',
        border: '1px solid rgba(148,163,184,0.2)',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <div style={{
          fontSize: '12px',
          color: '#94a3b8',
          fontWeight: 600,
          marginBottom: '8px'
        }}>
          {label}
        </div>
        
        <div style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: isOver ? '#ef4444' : color,
          marginBottom: '8px'
        }}>
          {Math.round(current)}
          <span style={{ fontSize: '16px', fontWeight: 'normal', color: '#64748b' }}>
            /{goal}{unit}
          </span>
        </div>

        <div style={{
          height: '8px',
          background: 'rgba(148,163,184,0.2)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '8px'
        }}>
          <div style={{
            height: '100%',
            background: isOver ? '#ef4444' : color,
            width: `${Math.min(percentage, 100)}%`,
            transition: 'width 0.3s'
          }} />
        </div>

        <div style={{
          fontSize: '12px',
          color: isOver ? '#ef4444' : '#10b981',
          fontWeight: 600
        }}>
          {isOver ? `+${Math.round(current - goal)}` : Math.round(goal - current)} remaining
        </div>
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
        color: '#06b6d4'
      }}>
        <Apple className="animate-pulse" size={48} />
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
        backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
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
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Apple size={36} />
            Nutrition
          </h1>

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

        {/* Date */}
        <div style={{
          marginBottom: '32px',
          color: '#94a3b8',
          fontSize: '14px'
        }}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>

        {/* Macro Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <MacroCard 
            label="CALORIES" 
            current={totals.calories} 
            goal={goals.calories} 
            color="#f59e0b"
            unit="cal"
          />
          <MacroCard 
            label="PROTEIN" 
            current={totals.protein} 
            goal={goals.protein} 
            color="#10b981"
          />
          <MacroCard 
            label="CARBS" 
            current={totals.carbs} 
            goal={goals.carbs} 
            color="#3b82f6"
          />
          <MacroCard 
            label="FAT" 
            current={totals.fat} 
            goal={goals.fat} 
            color="#ef4444"
          />
        </div>

        {/* Meals */}
        <div style={{
          background: 'rgba(16,185,129,0.05)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#10b981'
            }}>
              Today's Meals
            </h2>

            <button
              onClick={() => setShowAddMeal(true)}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
              Add Meal
            </button>
          </div>

          {todaysMeals.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px',
              color: '#64748b'
            }}>
              No meals logged today
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {todaysMeals.map(meal => (
                <div
                  key={meal.id}
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#fff',
                      marginBottom: '8px'
                    }}>
                      {meal.name}
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '12px',
                      color: '#94a3b8'
                    }}>
                      <span>{meal.calories} cal</span>
                      <span>P: {meal.protein}g</span>
                      <span>C: {meal.carbs}g</span>
                      <span>F: {meal.fat}g</span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeMeal(meal.id)}
                    style={{
                      width: '32px',
                      height: '32px',
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
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Meal Modal */}
        {showAddMeal && (
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
              maxWidth: '500px',
              width: '100%',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(5,150,105,0.05) 100%)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '16px',
              padding: '32px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#10b981',
                marginBottom: '24px'
              }}>
                Add Meal
              </h2>

              <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
                <input
                  type="text"
                  placeholder="Meal name"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  style={{
                    padding: '16px',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '16px'
                  }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <input
                    type="number"
                    placeholder="Calories"
                    value={newMeal.calories}
                    onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                    style={{
                      padding: '16px',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(16,185,129,0.3)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '16px'
                    }}
                  />

                  <input
                    type="number"
                    placeholder="Protein (g)"
                    value={newMeal.protein}
                    onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                    style={{
                      padding: '16px',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(16,185,129,0.3)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '16px'
                    }}
                  />

                  <input
                    type="number"
                    placeholder="Carbs (g)"
                    value={newMeal.carbs}
                    onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                    style={{
                      padding: '16px',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(16,185,129,0.3)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '16px'
                    }}
                  />

                  <input
                    type="number"
                    placeholder="Fat (g)"
                    value={newMeal.fat}
                    onChange={(e) => setNewMeal({ ...newMeal, fat: e.target.value })}
                    style={{
                      padding: '16px',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(16,185,129,0.3)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowAddMeal(false)}
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
                  onClick={addMeal}
                  disabled={!newMeal.name || !newMeal.calories}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: newMeal.name && newMeal.calories
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'rgba(148,163,184,0.2)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: newMeal.name && newMeal.calories ? 'pointer' : 'not-allowed'
                  }}
                >
                  Add Meal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
