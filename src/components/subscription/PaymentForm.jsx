// src/components/subscription/PaymentForm.jsx - Stripe Payment (Mock UI)
import React, { useState } from 'react';
import { CreditCard, Lock, Check } from 'lucide-react';

export default function PaymentForm({ plan, onSuccess, onCancel }) {
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substr(0, 19);
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substr(0, 2) + '/' + cleaned.substr(2, 2);
    }
    return cleaned;
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
      background: 'rgba(0,0,0,0.9)',
      backdropFilter: 'blur(10px)',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      
      <div style={{
        maxWidth: '480px',
        width: '100%',
        background: 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.95) 100%)',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: '20px',
        padding: '32px',
        animation: 'slideUp 0.4s ease-out'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 30px rgba(99,102,241,0.5)'
          }}>
            <CreditCard size={32} color="#fff" />
          </div>
          <h2 style={{ color: '#6366f1', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
            Upgrade to {plan?.name || 'Pro'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            ${plan?.price || 49}/month • Billed monthly
          </p>
        </div>

        {/* Plan Features */}
        <div style={{
          background: 'rgba(99,102,241,0.1)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#6366f1', marginBottom: '12px' }}>
            WHAT YOU'LL GET:
          </div>
          {[
            'Full AI Intelligence Engine',
            'Unlimited Wearable Integrations',
            '90-Day Health History',
            'Proactive Health Interventions',
            'Advanced Predictions',
            'Priority Support'
          ].map((feature, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
              color: '#94a3b8',
              fontSize: '13px'
            }}>
              <Check size={16} color="#10b981" />
              {feature}
            </div>
          ))}
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit}>
          {/* Card Number */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              CARD NUMBER
            </label>
            <input
              type="text"
              value={cardData.number}
              onChange={(e) => setCardData(prev => ({ ...prev, number: formatCardNumber(e.target.value) }))}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              required
              style={{
                width: '100%',
                background: 'rgba(148,163,184,0.1)',
                border: '1px solid rgba(148,163,184,0.3)',
                borderRadius: '12px',
                padding: '14px 16px',
                color: '#fff',
                fontSize: '16px',
                outline: 'none',
                fontFamily: 'monospace'
              }}
            />
          </div>

          {/* Expiry & CVC */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                EXPIRY
              </label>
              <input
                type="text"
                value={cardData.expiry}
                onChange={(e) => setCardData(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                placeholder="MM/YY"
                maxLength="5"
                required
                style={{
                  width: '100%',
                  background: 'rgba(148,163,184,0.1)',
                  border: '1px solid rgba(148,163,184,0.3)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  color: '#fff',
                  fontSize: '16px',
                  outline: 'none',
                  fontFamily: 'monospace'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                CVC
              </label>
              <input
                type="text"
                value={cardData.cvc}
                onChange={(e) => setCardData(prev => ({ ...prev, cvc: e.target.value.replace(/\D/g, '').substr(0, 4) }))}
                placeholder="123"
                maxLength="4"
                required
                style={{
                  width: '100%',
                  background: 'rgba(148,163,184,0.1)',
                  border: '1px solid rgba(148,163,184,0.3)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  color: '#fff',
                  fontSize: '16px',
                  outline: 'none',
                  fontFamily: 'monospace'
                }}
              />
            </div>
          </div>

          {/* Cardholder Name */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              CARDHOLDER NAME
            </label>
            <input
              type="text"
              value={cardData.name}
              onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="John Doe"
              required
              style={{
                width: '100%',
                background: 'rgba(148,163,184,0.1)',
                border: '1px solid rgba(148,163,184,0.3)',
                borderRadius: '12px',
                padding: '14px 16px',
                color: '#fff',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          {/* Security Notice */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <Lock size={16} color="#10b981" />
            <p style={{ color: '#10b981', fontSize: '12px', margin: 0 }}>
              Your payment is secure and encrypted
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              style={{
                padding: '16px',
                background: 'rgba(148,163,184,0.1)',
                border: '1px solid rgba(148,163,184,0.3)',
                borderRadius: '12px',
                color: '#94a3b8',
                fontSize: '14px',
                fontWeight: 600,
                cursor: isProcessing ? 'not-allowed' : 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              style={{
                padding: '16px',
                background: isProcessing 
                  ? 'rgba(148,163,184,0.2)' 
                  : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                boxShadow: isProcessing ? 'none' : '0 0 30px rgba(99,102,241,0.5)'
              }}
            >
              {isProcessing ? 'Processing...' : `Pay $${plan?.price || 49}/mo`}
            </button>
          </div>
        </form>

        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '11px', marginTop: '20px' }}>
          Cancel anytime • No hidden fees • 30-day money-back guarantee
        </p>
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