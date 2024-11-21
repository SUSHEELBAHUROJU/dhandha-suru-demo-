import { useState, useEffect, useCallback } from 'react';
import { retailers } from '../services/api/retailers';
import { useWebSocket } from './useWebSocket';

export function useRetailersList() {
  const [retailersList, setRetailersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const websocket = useWebSocket();

  const loadRetailers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await retailers.getAll();
      setRetailersList(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load retailers');
      console.error('Retailers loading error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRetailers();

    // Listen for real-time updates
    const handleRetailerUpdate = () => loadRetailers();
    websocket.addListener('credit_limit_updated', handleRetailerUpdate);

    return () => {
      websocket.removeListener('credit_limit_updated', handleRetailerUpdate);
    };
  }, [loadRetailers, websocket]);

  const refreshRetailers = async () => {
    await loadRetailers();
  };

  return { retailersList, loading, error, refreshRetailers };
}