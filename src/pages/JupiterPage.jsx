// src/pages/JupiterPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, AlertCircle, CreditCard, Activity } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';

export default function JupiterPage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stressSpending, setStressSpending] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectingPlaid, setConnectingPlaid] = useState(false);

  useEffect(() => {
    fetchFinancialData();
  }, [user]);

  const fetchFinancialData = async () => {
    if (!user?._id) return;
    
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const token = useAuthStore.getState().token;

      // Fetch accounts
      const accountsRes = await fetch(`${apiUrl}/jupiter/${user._id}/accounts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const accountsData = await accountsRes.json();
      
      // Fetch recent transactions
      const transactionsRes = await fetch(`${apiUrl}/jupiter/${user._id}/transactions?limit=10`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const transactionsData = await transactionsRes.json();

      // Fetch stress-spending correlation
      const stressRes = await fetch(`${apiUrl}/jupiter/${user._id}/stress-spending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const stressData = await stressRes.json();

      if (accountsData.success) setAccounts(accountsData.accounts || []);
      if (transactionsData.success) setTransactions(transactionsData.transactions || []);
      if (stressData.success) setStressSpending(stressData.data);
      
    } catch (err) {
      console.error('Error fetching financial data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const connectBankAccount = async () => {
    setConnectingPlaid(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const token = useAuthStore.getState().token;

      // Get Plaid Link token
      const response = await fetch(`${apiUrl}/jupiter/plaid/link-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (data.success && data.linkToken) {
        // Open Plaid Link (you'd need to install @plaid/react-plaid-link)
        alert('Plaid integration coming soon. For now, using demo data.');
      }
    } catch (err) {
      console.error('Error connecting bank:', err);
      setError('Failed to connect bank account');
    } finally {
      setConnectingPlaid(false);
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  const monthlySpending = transactions
    .filter(t => new Date(t.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size={64} text="Loading financial data..." />
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
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
            ♃ Jupiter
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>Wealth & Financial Intelligence</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '16px', marginBottom: '24px', color: '#ef4444' }}>
            {error}
          </div>
        )}

        {/* No Accounts - Connect Banking */}
        {accounts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '16px' }}>
            <DollarSign size={64} color="#f59e0b" style={{ margin: '0 auto 24px', opacity: 0.5 }} />
            <h2 style={{ color: '#f59e0b', fontSize: '24px', marginBottom: '16px' }}>Connect Your Bank Accounts</h2>
            <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
              Link your bank accounts to track spending, analyze patterns, and see how financial stress affects your health.
            </p>
            <Button 
              icon={<CreditCard size={20} />}
              onClick={connectBankAccount}
              disabled={connectingPlaid}
              loading={connectingPlaid}
            >
              Connect Bank Account (Plaid)
            </Button>
          </div>
        ) : (
          <>
            {/* Financial Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <MetricCard
                icon={<DollarSign size={24} color="#10b981" />}
                label="Total Balance"
                value={`$${totalBalance.toLocaleString()}`}
                trend="up"
                color="#10b981"
              />
              <MetricCard
                icon={<TrendingDown size={24} color="#ef4444" />}
                label="Monthly Spending"
                value={`$${monthlySpending.toLocaleString()}`}
                color="#ef4444"
              />
              <MetricCard
                icon={<Activity size={24} color="#f59e0b" />}
                label="Accounts"
                value={accounts.length}
                unit="connected"
                color="#f59e0b"
              />
            </div>

            {/* Stress-Spending Correlation */}
            {stressSpending && (
              <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <AlertCircle size={24} color="#ef4444" />
                  <h3 style={{ color: '#ef4444', fontSize: '20px', fontWeight: 'bold' }}>
                    Stress-Spending Alert
                  </h3>
                </div>
                <p style={{ color: '#fff', fontSize: '16px', lineHeight: 1.6, marginBottom: '16px' }}>
                  {stressSpending.correlation > 0.5 
                    ? `Your spending increases by ${Math.round(stressSpending.correlation * 100)}% when your HRV drops below baseline. This pattern has been detected ${stressSpending.occurrences} times in the last 30 days.`
                    : 'No significant correlation detected between stress levels and spending patterns.'}
                </p>
                {stressSpending.correlation > 0.5 && (
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 'bold', marginBottom: '8px' }}>
                      💡 Phoenix Recommendation:
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '14px' }}>
                      Consider setting spending limits on high-stress days or using a 24-hour cooling-off period for purchases over $100.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recent Transactions */}
            <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ color: '#f59e0b', fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
                Recent Transactions
              </h3>
              
              {transactions.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '32px' }}>
                  No transactions yet
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {transactions.map(transaction => (
                    <TransactionCard key={transaction._id} transaction={transaction} />
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

function MetricCard({ icon, label, value, unit, trend, color }) {
  return (
    <div style={{ background: 'rgba(148,163,184,0.05)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '12px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        {icon}
        <span style={{ color: '#94a3b8', fontSize: '14px' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '32px', fontWeight: 'bold', color }}>{value}</span>
        {unit && <span style={{ fontSize: '14px', color: '#64748b' }}>{unit}</span>}
      </div>
      {trend && (
        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {trend === 'up' ? <TrendingUp size={16} color="#10b981" /> : <TrendingDown size={16} color="#ef4444" />}
          <span style={{ fontSize: '12px', color: trend === 'up' ? '#10b981' : '#ef4444' }}>
            vs last month
          </span>
        </div>
      )}
    </div>
  );
}

function TransactionCard({ transaction }) {
  const isExpense = transaction.amount < 0;
  const color = isExpense ? '#ef4444' : '#10b981';
  
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        <div style={{ color: '#fff', fontWeight: 600, marginBottom: '4px' }}>
          {transaction.name || transaction.description}
        </div>
        <div style={{ fontSize: '12px', color: '#64748b' }}>
          {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
        </div>
      </div>
      <div style={{ fontSize: '20px', fontWeight: 'bold', color }}>
        {isExpense ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
      </div>
    </div>
  );
}