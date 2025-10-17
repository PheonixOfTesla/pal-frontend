// src/components/nutrition/MealLogger.jsx - Log Meals & Macros
import React, { useState } from 'react';
import { Utensils, Plus, X } from 'lucide-react';

export default function MealLogger({ onSave, onCancel }) {
  const [mealData, setMealData] = useState({
    name: '',
    mealType: 'breakfast',
    foods: [{ name: '', protein: '', carbs: '', fats: '', calories: '' }],
    notes: ''
  });

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { value: 'lunch', label: 'Lunch', icon: '☀️' },
    { value: 'dinner', label: 'Dinner', icon: '🌙' },
    { value: 'snack', label: 'Snack', icon: '🍎' }
  ];

  const addFood = () => {
    setMealData(prev => ({
      ...prev,
      foods: [...prev.foods, { name: '', protein: '', carbs: '', fats: '', calories: '' }]
    }));
  };

  const removeFood = (index) => {
    setMealData(prev => ({
      ...prev,
      foods: prev.foods.filter((_, i) => i !== index)
    }));
  };

  const updateFood = (index, field, value) => {
    setMealData(prev => ({
      ...prev,
      foods: prev.foods.map((food, i) => 
        i === index ? { ...food, [field]: value } : food
      )
    }));
  };

  const calculateTotals = () => {
    return mealData.foods.reduce((totals, food) => ({
      protein: totals.protein + (parseFloat(food.protein) || 0),
      carbs: totals.carbs + (parseFloat(food.carbs) || 0),
      fats: totals.fats + (parseFloat(food.fats) || 0),
      calories: totals.calories + (parseFloat(food.calories) || 0)
    }), { protein: 0, carbs: 0, fats: 0, calories: 0 });
  };

  const totals = calculateTotals();

  const handleSave = () => {
    onSave({
      ...mealData,
      totals,
      timestamp: new Date()
    });
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
        maxWidth: '600px',
        width: '100%',
        background: 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.95) 100%)',
        border: '1px solid rgba(34,197,94,0.3)',
        borderRadius: '20px',
        padding: '32px',
        maxHeight: '85vh',
        overflowY: 'auto',
        animation: 'slideUp 0.4s ease-out'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(34,197,94,0.4)'
          }}>
            <Utensils size={24} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ color: '#22c55e', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              Log Meal
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              Track your nutrition
            </p>
          </div>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Meal Name */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            MEAL NAME
          </label>
          <input
            type="text"
            value={mealData.name}
            onChange={(e) => setMealData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Post-workout meal"
            style={{
              width: '100%',
              background: 'rgba(148,163,184,0.1)',
              border: '1px solid rgba(148,163,184,0.3)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        {/* Meal Type */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            MEAL TYPE
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {mealTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setMealData(prev => ({ ...prev, mealType: type.value }))}
                style={{
                  padding: '12px',
                  background: mealData.mealType === type.value 
                    ? 'rgba(34,197,94,0.2)' 
                    : 'rgba(148,163,184,0.05)',
                  border: `1px solid ${mealData.mealType === type.value ? 'rgba(34,197,94,0.4)' : 'rgba(148,163,184,0.2)'}`,
                  borderRadius: '12px',
                  color: mealData.mealType === type.value ? '#22c55e' : '#94a3b8',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span style={{ fontSize: '20px' }}>{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Foods */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '12px', fontWeight: 600 }}>
            FOODS
          </label>
          {mealData.foods.map((food, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(148,163,184,0.05)',
                border: '1px solid rgba(148,163,184,0.2)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px'
              }}
            >
              {/* Food Name */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  value={food.name}
                  onChange={(e) => updateFood(index, 'name', e.target.value)}
                  placeholder="Food name"
                  style={{
                    flex: 1,
                    background: 'rgba(148,163,184,0.1)',
                    border: '1px solid rgba(148,163,184,0.3)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                {mealData.foods.length > 1 && (
                  <button
                    onClick={() => removeFood(index)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={18} color="#ef4444" />
                  </button>
                )}
              </div>

              {/* Macros Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {[
                  { key: 'protein', label: 'Protein', unit: 'g' },
                  { key: 'carbs', label: 'Carbs', unit: 'g' },
                  { key: 'fats', label: 'Fats', unit: 'g' },
                  { key: 'calories', label: 'Calories', unit: 'kcal' }
                ].map(macro => (
                  <div key={macro.key}>
                    <label style={{ fontSize: '10px', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      {macro.label.toUpperCase()}
                    </label>
                    <input
                      type="number"
                      value={food[macro.key]}
                      onChange={(e) => updateFood(index, macro.key, e.target.value)}
                      placeholder="0"
                      step="0.1"
                      style={{
                        width: '100%',
                        background: 'rgba(148,163,184,0.1)',
                        border: '1px solid rgba(148,163,184,0.3)',
                        borderRadius: '8px',
                        padding: '8px',
                        color: '#fff',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={addFood}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(34,197,94,0.1)',
              border: '1px dashed rgba(34,197,94,0.3)',
              borderRadius: '12px',
              color: '#22c55e',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Plus size={18} />
            Add Food
          </button>
        </div>

        {/* Totals */}
        <div style={{
          background: 'rgba(34,197,94,0.1)',
          border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <h3 style={{ color: '#22c55e', fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>
            MEAL TOTALS
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { label: 'Protein', value: totals.protein, color: '#06b6d4' },
              { label: 'Carbs', value: totals.carbs, color: '#f59e0b' },
              { label: 'Fats', value: totals.fats, color: '#ef4444' },
              { label: 'Calories', value: totals.calories, color: '#22c55e' }
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: item.color, marginBottom: '4px' }}>
                  {item.value.toFixed(1)}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            NOTES (OPTIONAL)
          </label>
          <textarea
            value={mealData.notes}
            onChange={(e) => setMealData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="How did you feel? Any observations?"
            style={{
              width: '100%',
              background: 'rgba(148,163,184,0.1)',
              border: '1px solid rgba(148,163,184,0.3)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#fff',
              fontSize: '14px',
              resize: 'vertical',
              minHeight: '80px',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '14px',
              background: 'rgba(148,163,184,0.1)',
              border: '1px solid rgba(148,163,184,0.3)',
              borderRadius: '12px',
              color: '#94a3b8',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!mealData.name || mealData.foods.every(f => !f.name)}
            style={{
              padding: '14px',
              background: !mealData.name || mealData.foods.every(f => !f.name)
                ? 'rgba(148,163,184,0.2)'
                : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: !mealData.name || mealData.foods.every(f => !f.name) ? 'not-allowed' : 'pointer',
              boxShadow: !mealData.name || mealData.foods.every(f => !f.name) ? 'none' : '0 0 20px rgba(34,197,94,0.4)'
            }}
          >
            Save Meal
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