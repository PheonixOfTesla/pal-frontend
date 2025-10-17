// src/pages/SubscriptionPage.jsx - Subscription Management with Stripe
import React, { useState, useEffect } from 'react';
import { CreditCard, Check, X, Zap, Crown, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, [user]);

  const loadSubscription = async () => {
    if (!user?._id) return;
    
    try {
      const response = await api.get(`/subscription/${user._id}`);
      if (response.data.success) {
        setCurrentPlan(response.data.subscription);
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToPlan = async (planId) => {
    try {
      const response = await api.post(`/subscription/${user._id}/subscribe`, {
        planId
      });

      if (response.data.success && response.data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.checkoutUrl;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start subscription. Please try again.');
    }
  };

  const manageBilling = async () => {
    try {
      const response = await api.post(`/subscription/${user._id}/portal`);
      
      if (response.data.success && response.data.portalUrl) {
        window.location.href = response.data.portalUrl;
      }
    } catch (error) {
      console.error('Portal error:', error);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Mercury',
      price: 0,
      icon: <Flame size={32} color="#64748b" />,
      color: '#64748b',
      features: [
        'Basic workout tracking',
        'Exercise library (500+)',
        'Body measurements',
        'Nutrition planning',
        'Single wearable connection',
        '7-day history',
        'Standard support'
      ],
      limits: [
        'No AI insights',
        'No predictions',
        'Limited data history'
      ]
    },
    {
      id: 'pro',
      name: 'Phoenix Pro',
      price: 49,
      icon: <Zap size={32} color="#06b6d4" />,
      color: '#06b6d4',
      popular: true,
      features: [
        'Everything in Free',
        'AI companion (text & voice)',
        'All planetary systems',
        'Multi-device wearables (6+)',
        'Proactive interventions',
        '30-day history',
        'Predictive intelligence',
        'Financial tracking',
        'Calendar integration',
        'Priority support'
      ]
    },
    {
      id: 'elite',
      name: 'Phoenix Elite',
      price: 99,
      icon: <Crown size={32} color="#f59e0b" />,
      color: '#f59e0b',
      features: [
        'Everything in Pro',
        'Unlimited data history',
        'Advanced ML predictions',
        'Custom training programs',
        'Dedicated specialist access',
        'API access',
        'White-label option',
        'Priority feature requests',
        '24/7 VIP support'
      ]
    }
  ];

  const PlanCard = ({ plan }) => {
    const isCurrentPlan = currentPlan?.planId === plan.id;
    const isFree = plan.id === 'free';

    return (
      <div style={{
        background: plan.popular 
          ? 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(8,145,178,0.1) 100%)'
          : 'rgba(148,163,184,0.05)',
        border: plan.popular 
          ? '2px solid #06b6d4'
          : isCurrentPlan
          ? '2px solid #10b981'
          : '1px solid rgba(148,163,184,0.2)',
        borderRadius: '20px',
        padding: '32px',
        position: 'relative',
        transition: 'all 0.3s',
        ...(plan.popular && {
          transform: 'scale(1.05)',
          boxShadow: '0 20px 60px rgba(6,182,212,0.3)'
        })
      }}>
        
        {/* Popular Badge */}
        {plan.popular && (
          <div style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '6px 20px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 4px 20px rgba(6,182,212,0.4)'
          }}>
            ⭐ Most Popular
          </div>
        )}

        {/* Current Plan Badge */}
        {isCurrentPlan && (
          <div style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            padding: '6px 12px',
            background: 'rgba(16,185,129,0.2)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Check size={14} />
            Current Plan
          </div>
        )}

        {/* Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: `${plan.color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          {plan.icon}
        </div>

        {/* Plan Name */}
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: '12px'
        }}>
          {plan.name}
        </h2>

        {/* Price */}