// src/pages/FinancesDashboard.jsx - Financial Health & Stress Correlation
import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, PiggyBank, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

export default function FinancesDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  const [financialData, setFinancialData] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [stressCorrelation, setStressCorrelation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFinancialData();
  }, [user]);

  const loadFinancialData = async () => {
    if (!user?._id) return;
    
    try {
      // Load financial overview
      const overviewResponse = await api.get(`/jupiter/${user._id}/overview`);
      if (overviewResponse.data.success) {
        setFinancialData(overviewResponse.data.data);
      }

      // Load accounts
      const accountsResponse = await api.get(`/jupiter/${user._id}/accounts`);
      if (accountsResponse.data.success) {
        setAccounts(accountsResponse.data.accounts || []);
      }

      // Load recent transactions
      const transactionsResponse = await api.get(`/jupiter/${user._id}/transactions`, {
        params: { limit: 10 }
      });
      if (transactionsResponse.data.success) {
        setRecentTransactions(transactionsResponse.data.transactions || []);
      }

      // Load stress-spending correlation
      const stressResponse = await api.get(`/jupiter/${user._id}/stress-correlation`);
      if (stressResponse.data.success) {
        setStressCorrelation(stressResponse.data.correlation);
      }
    } catch (error) {
      console.error('Failed to load financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectPlaid = async () => {
    try {
      const response = await api.post(`/jupiter/${user._id}/plaid/link-token`);
      
      if (response.data.success) {
        // Initialize Plaid Link (would require Plaid SDK)
        alert('Plaid integration would open here. Coming soon!');
      }
    } catch (error) {
      console.error('Plaid connection error:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const MetricCard = ({ icon, label, value, trend, color = '#06b6d4' }) => (
    <div style={{
      background: `${color}10`,
      border: `1px solid ${color}30`,
      borderRadius: '16px',
      padding: '24px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color
        }}>
          {icon}
        </div>

        {trend && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '14px',
            color: trend > 0 ? '#10b981' : '#ef4444',
            fontWeight: 600
          }}>
            {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

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
        color
      }}>
        {value}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#8b5cf6'
      }}>
        <DollarSign className="animate-pulse" size={48} />
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
        backgroundImage: 'linear-gradient(#8b5cf6 1px, transparent 1px), linear-gradient(90deg, #8b5cf6 1px, transparent 1px)',
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
            color: '#8b5cf6',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <DollarSign size={36} />
            Jupiter Financial Intelligence
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
          Track spending, analyze cash flow, and discover stress-spending patterns
        </p>

        {/* No Accounts - Connect Plaid */}
        {accounts.length === 0 ? (
          <div style={{
            background: 'rgba(139,92,246,0.1)',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: '20px',
            padding: '64px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <DollarSign size={64} color="#8b5cf6" style={{ marginBottom: '24px' }} />
            
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#8b5cf6',
              marginBottom: '16px'
            }}>
              Connect Your Bank Accounts
            </h2>

            <p style={{
              color: '#94a3b8',
              marginBottom: '32px',
              lineHeight: 1.6
            }}>
              Securely link your bank accounts via Plaid to track spending, 
              analyze cash flow, and discover correlations between stress and spending habits.
            </p>

            <button
              onClick={connectPlaid}
              style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(139,92,246,0.4)'
              }}
            >
              Connect with Plaid
            </button>

            <p style={{
              fontSize: '12px',
              color: '#64748b',
              marginTop: '24px'
            }}>
              🔒 Bank-level encryption • Read-only access • No data sharing
            </p>
          </div>
        ) : (
          <>
            {/* Overview Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }}>
              <MetricCard
                icon={<PiggyBank size={24} />}
                label="NET WORTH"
                value={formatCurrency(financialData?.netWorth || 0)}
                trend={5.2}
                color="#10b981"
              />

              <MetricCard
                icon={<TrendingUp size={24} />}
                label="MONTHLY INCOME"
                value={formatCurrency(financialData?.monthlyIncome || 0)}
                color="#06b6d4"
              />

              <MetricCard
                icon={<TrendingDown size={24} />}
                label="MONTHLY EXPENSES"
                value={formatCurrency(financialData?.monthlyExpenses || 0)}
                trend={-3.1}
                color="#ef4444"
              />

              <MetricCard
                icon={<DollarSign size={24} />}
                label="CASH FLOW"
                value={formatCurrency((financialData?.monthlyIncome || 0) - (financialData?.monthlyExpenses || 0))}
                color="#f59e0b"
              />
            </div>

            {/* Stress-Spending Correlation */}
            {stressCorrelation && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '32px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}>
                  <AlertTriangle size={32} color="#ef4444" />
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#ef4444',
                      marginBottom: '12px'
                    }}>
                      Stress-Spending Alert
                    </h3>

                    <p style={{
                      color: '#94a3b8',
                      fontSize: '14px',
                      lineHeight: 1.6,
                      marginBottom: '16px'
                    }}>
                      Phoenix detected a correlation between low HRV (high stress) and increased spending. 
                      You spent <strong style={{ color: '#ef4444' }}>{formatCurrency(stressCorrelation.stressSpending)}</strong> on 
                      days when your HRV was below 50ms.
                    </p>

                    <div style={{
                      display: 'flex',
                      gap: '24px',
                      fontSize: '14px'
                    }}>
                      <div>
                        <div style={{ color: '#64748b', marginBottom: '4px' }}>Low HRV Days</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>
                          {stressCorrelation.lowHRVDays} days
                        </div>
                      </div>

                      <div>
                        <div style={{ color: '#64748b', marginBottom: '4px' }}>Avg Spending/Day</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>
                          {formatCurrency(stressCorrelation.avgSpendingPerDay)}
                        </div>
                      </div>

                      <div>
                        <div style={{ color: '#64748b', marginBottom: '4px' }}>Correlation</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>
                          {(stressCorrelation.correlation * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Accounts Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }}>
              {accounts.map(account => (
                <div
                  key={account._id}
                  style={{
                    background: 'rgba(139,92,246,0.1)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    borderRadius: '16px',
                    padding: '24px'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(139,92,246,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CreditCard size={20} color="#8b5cf6" />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#fff',
                        marginBottom: '4px'
                      }}>
                        {account.name}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#64748b'
                      }}>
                        ••••{account.mask}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#8b5cf6'
                  }}>
                    {formatCurrency(account.currentBalance)}
                  </div>

                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    marginTop: '8px'
                  }}>
                    {account.type.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Transactions */}
            <div style={{
              background: 'rgba(139,92,246,0.05)',
              border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#8b5cf6',
                marginBottom: '24px'
              }}>
                Recent Transactions
              </h2>

              {recentTransactions.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '48px',
                  color: '#64748b'
                }}>
                  No transactions yet
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {recentTransactions.map(transaction => (
                    <div
                      key={transaction._id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(139,92,246,0.2)',
                        borderRadius: '12px'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#fff',
                          marginBottom: '4px'
                        }}>
                          {transaction.name}
                        </div>
                        <div style={{
                          display: 'flex',
                          gap: '12px',
                          fontSize: '12px',
                          color: '#64748b'
                        }}>
                          <span>{transaction.category?.join(', ')}</span>
                          <span>•</span>
                          <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: transaction.amount < 0 ? '#10b981' : '#ef4444'
                      }}>
                        {transaction.amount < 0 ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
