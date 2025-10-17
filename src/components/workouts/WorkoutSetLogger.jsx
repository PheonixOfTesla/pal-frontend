// src/components/workouts/WorkoutSetLogger.jsx - Log Sets & Reps
import React, { useState } from 'react';
import { Check, Plus, Trash2, Dumbbell } from 'lucide-react';
import { workoutService } from '../../services/api';

export default function WorkoutSetLogger({ workout, exercise, onComplete, onCancel }) {
  const [sets, setSets] = useState([
    { setNumber: 1, reps: '', weight: '', completed: false }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const addSet = () => {
    setSets(prev => [
      ...prev,
      { setNumber: prev.length + 1, reps: '', weight: '', completed: false }
    ]);
  };

  const removeSet = (index) => {
    setSets(prev => prev.filter((_, i) => i !== index).map((set, i) => ({
      ...set,
      setNumber: i + 1
    })));
  };

  const updateSet = (index, field, value) => {
    setSets(prev => prev.map((set, i) => 
      i === index ? { ...set, [field]: value } : set
    ));
  };

  const toggleSetComplete = (index) => {
    setSets(prev => prev.map((set, i) => 
      i === index ? { ...set, completed: !set.completed } : set
    ));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Log each set
      for (const set of sets) {
        if (set.reps && set.weight) {
          await workoutService.logSet(workout._id, {
            exerciseId: exercise._id,
            setNumber: set.setNumber,
            reps: parseInt(set.reps),
            weight: parseFloat(set.weight),
            completed: set.completed
          });
        }
      }
      
      onComplete();
    } catch (error) {
      console.error('Error logging sets:', error);
      alert('Failed to log sets. Please try again.');
    } finally {
      setIsLoading(false);
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
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(10px)',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.95) 100%)',
        border: '1px solid rgba(249,115,22,0.3)',
        borderRadius: '20px',
        padding: '32px',
        maxHeight: '80vh',
        overflowY: 'auto',
        animation: 'slideUp 0.4s ease-out'
      }}>
        
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(249,115,22,0.4)'
            }}>
              <Dumbbell size={24} color="#fff" />
            </div>
            <div>
              <h2 style={{ color: '#f97316', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                Log Sets
              </h2>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                {exercise.name}
              </p>
            </div>
          </div>
        </div>

        {/* Sets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {sets.map((set, index) => (
            <div
              key={index}
              style={{
                background: set.completed 
                  ? 'rgba(16,185,129,0.1)' 
                  : 'rgba(148,163,184,0.05)',
                border: `1px solid ${set.completed ? 'rgba(16,185,129,0.3)' : 'rgba(148,163,184,0.2)'}`,
                borderRadius: '12px',
                padding: '16px',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr 1fr auto auto',
                gap: '12px',
                alignItems: 'center'
              }}
            >
              {/* Set Number */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: set.completed ? 'rgba(16,185,129,0.2)' : 'rgba(249,115,22,0.1)',
                border: `1px solid ${set.completed ? 'rgba(16,185,129,0.3)' : 'rgba(249,115,22,0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: set.completed ? '#10b981' : '#f97316',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {set.setNumber}
              </div>

              {/* Reps Input */}
              <div>
                <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  REPS
                </label>
                <input
                  type="number"
                  value={set.reps}
                  onChange={(e) => updateSet(index, 'reps', e.target.value)}
                  placeholder="0"
                  style={{
                    width: '100%',
                    background: 'rgba(148,163,184,0.1)',
                    border: '1px solid rgba(148,163,184,0.3)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Weight Input */}
              <div>
                <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  WEIGHT (LBS)
                </label>
                <input
                  type="number"
                  value={set.weight}
                  onChange={(e) => updateSet(index, 'weight', e.target.value)}
                  placeholder="0"
                  step="0.5"
                  style={{
                    width: '100%',
                    background: 'rgba(148,163,184,0.1)',
                    border: '1px solid rgba(148,163,184,0.3)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Complete Button */}
              <button
                onClick={() => toggleSetComplete(index)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: set.completed ? 'rgba(16,185,129,0.2)' : 'rgba(148,163,184,0.1)',
                  border: `1px solid ${set.completed ? 'rgba(16,185,129,0.3)' : 'rgba(148,163,184,0.3)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Check size={20} color={set.completed ? '#10b981' : '#64748b'} />
              </button>

              {/* Delete Button */}
              {sets.length > 1 && (
                <button
                  onClick={() => removeSet(index)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Trash2 size={18} color="#ef4444" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Set Button */}
        <button
          onClick={addSet}
          style={{
            width: '100%',
            padding: '12px',
            background: 'rgba(249,115,22,0.1)',
            border: '1px dashed rgba(249,115,22,0.3)',
            borderRadius: '12px',
            color: '#f97316',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '24px',
            transition: 'all 0.2s'
          }}
        >
          <Plus size={18} />
          Add Set
        </button>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            onClick={onCancel}
            disabled={isLoading}
            style={{
              padding: '14px',
              background: 'rgba(148,163,184,0.1)',
              border: '1px solid rgba(148,163,184,0.3)',
              borderRadius: '12px',
              color: '#94a3b8',
              fontSize: '14px',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || sets.every(s => !s.reps || !s.weight)}
            style={{
              padding: '14px',
              background: isLoading || sets.every(s => !s.reps || !s.weight)
                ? 'rgba(148,163,184,0.2)'
                : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: isLoading || sets.every(s => !s.reps || !s.weight) ? 'not-allowed' : 'pointer',
              boxShadow: isLoading || sets.every(s => !s.reps || !s.weight) ? 'none' : '0 0 20px rgba(249,115,22,0.4)',
              transition: 'all 0.2s'
            }}
          >
            {isLoading ? 'Saving...' : 'Save Sets'}
          </button>
        </div>
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