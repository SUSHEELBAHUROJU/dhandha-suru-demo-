import { useEffect } from 'react';
import { websocketService } from '../services/websocket';
import { useAuth } from '../context/AuthContext';

export function useWebSocket() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      websocketService.connect(user.id.toString(), user.user_type);
      return () => websocketService.disconnect();
    }
  }, [user]);

  return websocketService;
}