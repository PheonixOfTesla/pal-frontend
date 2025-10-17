import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

export function useWebSocket(channel, onMessage) {
  const wsRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const token = useAuthStore(state => state.token);
  const user = useAuthStore(state => state.user);

  const connect = useCallback(() => {
    if (!token || !user) {
      console.log('⚠️ No token or user - skipping WebSocket connection');
      return;
    }

    try {
      // Production WebSocket URL - NO LOCALHOST FALLBACK
      const wsUrl = process.env.REACT_APP_WS_URL || 'wss://pal-backend-production.up.railway.app/ws';
      
      console.log(`🔌 Connecting to WebSocket: ${wsUrl}`);
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log(`✅ WebSocket connected`);
        setIsConnected(true);
        setError(null);
        
        // Authenticate with token
        ws.send(JSON.stringify({ 
          type: 'auth', 
          token 
        }));

        // Subscribe to channel
        if (channel) {
          ws.send(JSON.stringify({ 
            type: 'subscribe', 
            channel 
          }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle auth response
          if (data.type === 'auth_success') {
            console.log('✅ WebSocket authenticated:', data.userId);
          }
          
          if (data.type === 'auth_error') {
            console.error('❌ WebSocket auth failed:', data.message);
            setError('Authentication failed');
            ws.close();
            return;
          }

          // Handle subscribed confirmation
          if (data.type === 'subscribed') {
            console.log(`✅ Subscribed to channel: ${data.channel}`);
          }

          // Pass messages to callback
          if (onMessage) {
            onMessage(data);
          }
        } catch (err) {
          console.error('WebSocket message parse error:', err);
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        setError('Connection error');
      };

      ws.onclose = () => {
        console.log('❌ WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt reconnection after 3 seconds if we have auth
        if (token && user) {
          setTimeout(() => {
            console.log('🔄 Attempting to reconnect...');
            connect();
          }, 3000);
        }
      };

      wsRef.current = ws;

    } catch (err) {
      console.error('WebSocket connection error:', err);
      setError(err.message);
    }
  }, [channel, token, user, onMessage]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const send = useCallback((data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  return { isConnected, error, send, disconnect };
}
