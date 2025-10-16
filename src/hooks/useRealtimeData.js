// src/hooks/useRealtimeData.js
import { useState, useEffect, useCallback } from 'react';
import wsManager from '../services/websocket';

export default function useRealtimeData(userId) {
  const [metrics, setMetrics] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    if (!userId) return;

    // Connect to WebSocket
    wsManager.connect(userId);

    // Subscribe to events
    const unsubscribeConnected = wsManager.on('connected', () => {
      setIsConnected(true);
    });

    const unsubscribeDisconnected = wsManager.on('disconnected', () => {
      setIsConnected(false);
    });

    const unsubscribeMetrics = wsManager.on('metrics', (data) => {
      setMetrics(data);
      setLastUpdate(new Date());
    });

    // Cleanup
    return () => {
      unsubscribeConnected();
      unsubscribeDisconnected();
      unsubscribeMetrics();
    };
  }, [userId]);

  const sendMetricUpdate = useCallback((metricType, value) => {
    if (wsManager.isConnected()) {
      wsManager.send({
        type: 'metric-update',
        metricType,
        value,
        timestamp: new Date().toISOString()
      });
    }
  }, []);

  const subscribeToMetric = useCallback((metricType, callback) => {
    return wsManager.on('metrics', (data) => {
      if (data.type === metricType) {
        callback(data);
      }
    });
  }, []);

  return {
    metrics,
    isConnected,
    lastUpdate,
    sendMetricUpdate,
    subscribeToMetric
  };
}