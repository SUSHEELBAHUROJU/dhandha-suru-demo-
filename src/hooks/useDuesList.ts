import { useState, useEffect, useCallback } from 'react';
import { Due, dues } from '../services/api/dues';
import { useWebSocket } from './useWebSocket';

export function useDuesList() {
  const [duesList, setDuesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const websocket = useWebSocket();

  const loadDues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dues.getAll();
      setDuesList(data as Due[]);
    } catch (err: any) {
      setError(err.message || 'Failed to load dues');
      console.error('Dues loading error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDues();

    // Listen for real-time updates
    const handleDueUpdate = () => loadDues();
    websocket.addListener('due_created', handleDueUpdate);
    websocket.addListener('due_updated', handleDueUpdate);
    websocket.addListener('payment_made', handleDueUpdate);

    return () => {
      websocket.removeListener('due_created', handleDueUpdate);
      websocket.removeListener('due_updated', handleDueUpdate);
      websocket.removeListener('payment_made', handleDueUpdate);
    };
  }, [loadDues, websocket]);

  const refreshDues = async () => {
    await loadDues();
  };

  return { duesList, loading, error, refreshDues };
}