// src/pages/PredictionsPanel.jsx - ML-Powered Predictions & Forecasting
import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Activity, X, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

export default function PredictionsPanel() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPredictions();
  }, [user]);

  const loadPredictions = async () => {
    if (!user?._id) return;
    
    try {
      const response = await api.get(`/predictions/${user._id}`);
      if (response.data.success) {
        setPredictions(response.data.predictions);
      }
    } catch (error) {
      console.error('Failed to load predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const PredictionCard = ({ title, value, confidence, trend, forecast, risk, icon, color }) => (
    <div style={{
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      border: `1px solid ${color}30`,
      borderRadius: '16px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Risk Badge */}
      {risk && risk !== 'low' && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          padding: '6px 12px',
          background: risk === 'high' ? 'rgba(239,68,68,0.3)' : 'rgba(251,146,60,0.3)',
          border: risk === 'high' ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(251,146,60,0.5)',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: 700,
          color: risk === 'high' ? '#ef4444' : '#fb923c',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {risk} Risk
        </div>
      )}

      {/* Icon */}
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        color
      }}>
        {icon}
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: '12px'
      }}>
        {title}
      </h3>

      {/* Main Value */}
      <div style={{
        fontSize: '48px',
        fontWeight: 'bold',
        color,
        marginBottom: '8px',
        lineHeight: 1
      }}>
        {value}
      </div>

      {/* Confidence */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '20px',
        fontSize: '14px',
        color: '#94a3b8'
      }}>
        <Brain size={16} />
        <span>{confidence}% confidence</span>
      </div>

      {/* Forecast Bar */}
      {forecast && (
        <div>
          <div style={{
            fontSize: '12px',
            color: '#64748b',
            marginBottom: '8px',
            fontWeight: 600
          }}>
            7-DAY FORECAST
          </div>
          <div style={{
            display: 'flex',
            gap: '4px',
            height: '40px',
            alignItems: 'flex-end'
          }}>
            {forecast.map((val, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  background: `${color}40`,
                  borderRadius: '4px 4px 0 0',
                  height: `${val}%`,
                  position: 'relative',
                  transition: 'height 0.3s'
                }}
                title={`Day ${idx + 1}: ${val}%`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Trend Indicator */}
      {trend && (
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(148,163,184,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          color: trend.direction === 'up' ? '#10b981' : trend.direction === 'down' ? '#ef4444' : '#64748b',
          fontWeight: 600
        }}>
          <TrendingUp 
            size={16} 
            style={{ 
              transform: trend.direction === 'down' ? 'rotate(180deg)' : 'none' 
            }} 
          />
          {trend.text}
        </div>
      )}
    </div>
  );

  const IllnessRiskCard = ({ risk }) => {
    const getRiskColor = (level) => {
      if (level === 'low') return '#10b981';
      if (level === 'moderate') return '#f59e0b';
      return '#ef4444';
    };

    const getRiskPercentage = (level) => {
      if (level === 'low') return 15;
      if (level === 'moderate') return 45;
      return 75;
    };

    return (
      <div style={{
        background: 'rgba(239,68,68,0.1)',
        border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: '16px',
        padding: '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <AlertTriangle size={32} color={getRiskColor(risk.level)} />
          <div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#fff',
              marginBottom: '4px'
            }}>
              Illness Risk Prediction
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#94a3b8'
            }}>
              Based on HRV, sleep, and training load
            </p>
          </div>
        </div>

        {/* Risk Meter */}
        <div style={{
          background: 'rgba(148,163,184,0.2)',
          height: '12px',
          borderRadius: '6px',
          overflow: 'hidden',
          marginBottom: '16px',
          position: 'relative'
        }}>
          <div style={{
            height: '100%',
            background: `linear-gradient(90deg, ${getRiskColor(risk.level)}cc, ${getRiskColor(risk.level)})`,
            width: `${getRiskPercentage(risk.level)}%`,
            transition: 'width 0.5s',
            boxShadow: `0 0 20px ${getRiskColor(risk.level)}80`
          }} />
        </div>

        {/* Risk Level */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <span style={{
            fontSize: '14px',
            color: '#94a3b8'
          }}>
            Risk Level
          </span>
          <span style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: getRiskColor(risk.level),
            textTransform: 'uppercase'
          }}>
            {risk.level}
          </span>
        </div>

        {/* Contributing Factors */}
        <div>
          <div style={{
            fontSize: '12px',
            color: '#64748b',
            fontWeight: 600,
            marginBottom: '12px'
          }}>
            CONTRIBUTING FACTORS
          </div>
          <div style={{ display: 'grid', gap: '8px' }}>
            {risk.factors?.map((factor, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <span style={{ color: '#94a3b8' }}>{factor.name}</span>
                <span style={{ 
                  color: factor.impact === 'high' ? '#ef4444' : '#f59e0b',
                  fontWeight: 600
                }}>
                  {factor.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        {risk.recommendation && (
          <div style={{
            marginTop: '20px',
            padding: '16px',
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: '12px',
            fontSize: '14px',
            color: '#94a3b8',
            lineHeight: 1.6
          }}>
            <strong style={{ color: '#3b82f6' }}>💡 Phoenix Recommendation:</strong>
            <br />
            {risk.recommendation}
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
        color: '#3b82f6'
      }}>
        <Brain className="animate-pulse" size={48} />
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
        backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative'
      }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Brain size={36} />
            Predictive Intelligence
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

        <p style={{
          color: '#94a3b8',
          fontSize: '16px',
          marginBottom: '32px'
        }}>
          ML-powered forecasts based on your historical patterns and current metrics
        </p>

        {!predictions ? (
          <div style={{
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: '20px',
            padding: '64px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <Brain size={64} color="#3b82f6" style={{ marginBottom: '24px' }} />
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#3b82f6',
              marginBottom: '16px'
            }}>
              Gathering Prediction Data
            </h2>
            <p style={{
              color: '#94a3b8',
              marginBottom: '24px'
            }}>
              Phoenix needs at least 7 days of data to generate accurate predictions.
              Keep syncing your wearables!
            </p>
          </div>
        ) : (
          <>
            {/* Illness Risk - Full Width */}
            {predictions.illnessRisk && (
              <div style={{ marginBottom: '32px' }}>
                <IllnessRiskCard risk={predictions.illnessRisk} />
              </div>
            )}

            {/* Prediction Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '24px',
              marginBottom: '32px'
            }}>
              {/* HRV Prediction */}
              {predictions.hrv && (
                <PredictionCard
                  title="HRV Forecast"
                  value={`${Math.round(predictions.hrv.predicted)}ms`}
                  confidence={predictions.hrv.confidence}
                  forecast={predictions.hrv.next7Days}
                  icon={<Activity size={28} />}
                  color="#10b981"
                  trend={{
                    direction: predictions.hrv.trend,
                    text: predictions.hrv.trend === 'up' 
                      ? 'Improving recovery' 
                      : 'Declining trend detected'
                  }}
                  risk={predictions.hrv.predicted < 40 ? 'high' : predictions.hrv.predicted < 60 ? 'moderate' : 'low'}
                />
              )}

              {/* Recovery Score Prediction */}
              {predictions.recovery && (
                <PredictionCard
                  title="Recovery Forecast"
                  value={`${Math.round(predictions.recovery.predicted)}%`}
                  confidence={predictions.recovery.confidence}
                  forecast={predictions.recovery.next7Days}
                  icon={<TrendingUp size={28} />}
                  color="#06b6d4"
                  trend={{
                    direction: predictions.recovery.trend,
                    text: `${Math.abs(predictions.recovery.change)}% ${predictions.recovery.trend === 'up' ? 'increase' : 'decrease'} expected`
                  }}
                  risk={predictions.recovery.predicted < 40 ? 'high' : predictions.recovery.predicted < 60 ? 'moderate' : 'low'}
                />
              )}

              {/* Goal Completion Prediction */}
              {predictions.goalCompletion && (
                <PredictionCard
                  title="Goal Success Probability"
                  value={`${Math.round(predictions.goalCompletion.probability)}%`}
                  confidence={predictions.goalCompletion.confidence}
                  icon={<TrendingUp size={28} />}
                  color="#8b5cf6"
                  trend={{
                    direction: predictions.goalCompletion.onTrack ? 'up' : 'down',
                    text: predictions.goalCompletion.onTrack 
                      ? `On track (${predictions.goalCompletion.daysRemaining} days left)`
                      : 'Behind schedule - adjust targets'
                  }}
                />
              )}
            </div>

            {/* Info Box */}
            <div style={{
              background: 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(59,130,246,0.3)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#3b82f6',
                marginBottom: '12px'
              }}>
                🧠 How Predictions Work
              </h3>
              <p style={{
                color: '#94a3b8',
                fontSize: '14px',
                lineHeight: 1.7,
                marginBottom: '12px'
              }}>
                Phoenix uses machine learning to analyze your historical patterns, current metrics, 
                and training load to forecast future states. Predictions improve with more data.
              </p>
              <ul style={{
                color: '#94a3b8',
                fontSize: '14px',
                lineHeight: 1.8,
                paddingLeft: '20px'
              }}>
                <li>HRV trends predict recovery and illness risk</li>
                <li>Sleep patterns forecast energy levels</li>
                <li>Training load predicts overtraining risk</li>
                <li>Goal progress estimates completion probability</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
