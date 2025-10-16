import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

export function useRealTimeVitals(interval = 5000) {
  const user = useAuthStore(state => state.user);
  const [vitals, setVitals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVitals = useCallback(async () => {
    if (!user?._id) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/intelligence/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${useAuthStore.getState().token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch vitals');

      const data = await response.json();
      if (data.success) {
        setVitals(data.data);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching vitals:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchVitals();
    const intervalId = setInterval(fetchVitals, interval);
    return () => clearInterval(intervalId);
  }, [fetchVitals, interval]);

  return { vitals, loading, error, refetch: fetchVitals };
}