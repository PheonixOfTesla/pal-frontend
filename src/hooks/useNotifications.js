// src/hooks/useNotifications.js
import { useState, useEffect, useCallback } from 'react';

export default function useNotifications() {
  const [permission, setPermission] = useState('default');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  const showNotification = useCallback(async (title, options = {}) => {
    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return null;
    }

    const defaultOptions = {
      icon: '/phoenix-icon.png',
      badge: '/phoenix-badge.png',
      vibrate: [200, 100, 200],
      tag: 'phoenix-notification',
      requireInteraction: false,
      ...options
    };

    const notification = new Notification(title, defaultOptions);

    // Add to notification history
    const notificationData = {
      id: Date.now(),
      title,
      body: options.body || '',
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [notificationData, ...prev].slice(0, 50)); // Keep last 50

    // Auto-close after 5 seconds if not interactive
    if (!options.requireInteraction) {
      setTimeout(() => notification.close(), 5000);
    }

    return notification;
  }, [permission, requestPermission]);

  const showInterventionNotification = useCallback((intervention) => {
    const severityEmoji = {
      critical: '🚨',
      high: '⚠️',
      medium: '⚡',
      low: 'ℹ️'
    };

    return showNotification(
      `${severityEmoji[intervention.severity]} Phoenix Alert`,
      {
        body: intervention.message,
        requireInteraction: intervention.severity === 'critical',
        data: { type: 'intervention', ...intervention }
      }
    );
  }, [showNotification]);

  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    permission,
    notifications,
    unreadCount,
    requestPermission,
    showNotification,
    showInterventionNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };
}