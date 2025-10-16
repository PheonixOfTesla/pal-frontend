// src/services/websocket.js - PRODUCTION WebSocket Manager
class WebSocketManager {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.listeners = new Map();
    this.isConnecting = false;
    this.userId = null;
    this.token = null;
  }

  /**
   * Connect to main WebSocket (not voice)
   */
  connect(userId, token) {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.userId = userId;
    this.token = token;
    this.isConnecting = true;

    const wsUrl = process.env.REACT_APP_WS_URL || 'wss://pal-backend-production.up.railway.app/ws';

    try {
      this.ws = new WebSocket(`${wsUrl}?userId=${userId}&token=${token}`);

      this.ws.onopen = () => {
        console.log('✅ WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.emit('connected', { userId });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket message:', data);
          
          // Emit to all listeners for this event type
          this.emit(data.type, data);
        } catch (err) {
          console.error('❌ WebSocket message parse error:', err);
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        this.isConnecting = false;
        this.emit('error', error);
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        this.isConnecting = false;
        this.emit('disconnected', {});
        
        // Auto-reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`🔄 Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          setTimeout(() => {
            if (this.userId && this.token) {
              this.connect(this.userId, this.token);
            }
          }, this.reconnectDelay);
        }
      };

    } catch (err) {
      console.error('❌ WebSocket connection error:', err);
      this.isConnecting = false;
    }
  }

  /**
   * Send message through WebSocket
   */
  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('⚠️ WebSocket not connected, cannot send:', data);
    }
  }

  /**
   * Subscribe to event type
   */
  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Emit event to listeners
   */
  emit(eventType, data) {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (err) {
          console.error(`❌ Error in ${eventType} listener:`, err);
        }
      });
    }
  }

  /**
   * Check if connected
   */
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Disconnect
   */
  disconnect() {
    if (this.ws) {
      this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }
}

// Singleton instance
const wsManager = new WebSocketManager();
export default wsManager;
