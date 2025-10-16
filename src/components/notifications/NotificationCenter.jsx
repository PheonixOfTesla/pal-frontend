// src/components/notifications/NotificationCenter.jsx
import React, { useState } from 'react';
import { Bell, X, Check, AlertTriangle } from 'lucide-react';
import useNotifications from '../../hooks/useNotifications';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications 
  } = useNotifications();

  return (
    <>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          background: 'rgba(148,163,184,0.1)',
          border: '1px solid rgba(148,163,184,0.2)',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(148,163,184,0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(148,163,184,0.1)';
        }}
      >
        <Bell size={20} color="#94a3b8" />
        {unreadCount > 0 && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: '#ef4444',
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#fff'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          width: '400px',
          maxHeight: '600px',
          background: '#1e293b',
          border: '1px solid rgba(148,163,184,0.2)',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid rgba(148,163,184,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', margin: 0 }}>
                Notifications
              </h3>
              {unreadCount > 0 && (
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  {unreadCount} unread
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#3b82f6',
                    fontSize: '12px',
                    cursor: 'pointer',
                    padding: '4px 8px'
                  }}
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px'
          }}>
            {notifications.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#64748b'
              }}>
                <Bell size={48} style={{ marginBottom: '12px', opacity: 0.3 }} />
                <div>No notifications</div>
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={() => markAsRead(notification.id)}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div style={{
              padding: '12px 20px',
              borderTop: '1px solid rgba(148,163,184,0.1)',
              textAlign: 'center'
            }}>
              <button
                onClick={clearNotifications}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '12px',
                  cursor: 'pointer',
                  padding: '4px 8px'
                }}
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function NotificationItem({ notification, onMarkRead }) {
  return (
    <div
      style={{
        background: notification.read 
          ? 'rgba(148,163,184,0.03)'
          : 'rgba(59,130,246,0.1)',
        border: notification.read
          ? '1px solid rgba(148,163,184,0.1)'
          : '1px solid rgba(59,130,246,0.2)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onClick={onMarkRead}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = notification.read
          ? 'rgba(148,163,184,0.1)'
          : 'rgba(59,130,246,0.2)';
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '8px' 
      }}>
        <div style={{ 
          fontSize: '14px', 
          fontWeight: 600, 
          color: notification.read ? '#94a3b8' : '#fff' 
        }}>
          {notification.title}
        </div>
        {!notification.read && (
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#3b82f6',
            flexShrink: 0,
            marginLeft: '8px',
            marginTop: '4px'
          }} />
        )}
      </div>
      <div style={{ 
        fontSize: '13px', 
        color: '#94a3b8',
        lineHeight: '1.6',
        marginBottom: '8px' 
      }}>
        {notification.body}
      </div>
      <div style={{ 
        fontSize: '11px', 
        color: '#64748b' 
      }}>
        {new Date(notification.timestamp).toLocaleString()}
      </div>
    </div>
  );
}