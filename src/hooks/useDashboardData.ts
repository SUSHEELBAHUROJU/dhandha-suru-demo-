import { useState, useEffect, useCallback } from 'react';
import { dashboard } from '../services/api/dashboard';
import { useAuth } from '../context/AuthContext';

export function useDashboardData() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await dashboard.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load dashboard data');
      console.error('Dashboard data error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        await loadData();
      } catch (err) {
        if (mounted) {
          console.error('Failed to load initial dashboard data:', err);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [loadData]);

  const refreshData = async () => {
    await loadData();
  };

  return { stats, loading, error, refreshData };
}