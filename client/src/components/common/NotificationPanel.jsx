import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../services/api';

export const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/notifications');
      if (res.success) {
        setNotifications(res.data);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (e) {
      console.warn('Failed to load notifications', e.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial notifications on mount
  useEffect(() => {
    fetchNotifications();
    // Periodically sync reminders every 3 minutes
    const interval = setInterval(fetchNotifications, 180000);
    return () => clearInterval(interval);
  }, []);

  // Close panel on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen((prev) => !prev);
  };

  const handleMarkAsRead = async (notifId, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await apiRequest(`/notifications/${notifId}/read`, { method: 'PATCH' });
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === notifId ? { ...n, isRead: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (err) {
      console.warn('Failed to mark read', err.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await apiRequest('/notifications/read-all', { method: 'PATCH' });
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.warn('Failed to mark all as read', err.message);
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="notif-panel-wrapper" ref={panelRef}>
      <button
        type="button"
        className="notif-bell-btn"
        onClick={handleToggle}
        aria-label="Notifications"
        title="View Deadline Reminders"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="notif-unread-badge" aria-label={`${unreadCount} unread notifications`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <span className="notif-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="var(--primary)">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span>Notifications {unreadCount > 0 && `(${unreadCount})`}</span>
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                className="notif-mark-all-btn"
                onClick={handleMarkAllAsRead}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="notif-list">
            {loading && notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Checking task deadlines...
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" color="var(--text-dim)" style={{ marginBottom: '8px' }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                  All caught up!
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  No urgent or overdue deadline alerts right now.
                </div>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`notif-item ${!notif.isRead ? 'notif-unread' : ''} notif-type-${notif.type}`}
                  onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                >
                  <div className="notif-item-top">
                    <span className="notif-item-title">{notif.title}</span>
                    <span className="notif-item-time">{formatTimeAgo(notif.createdAt)}</span>
                  </div>
                  <p className="notif-item-message">{notif.message}</p>
                  
                  <div className="notif-item-footer">
                    {notif.taskId ? (
                      <Link
                        to={`/tasks/edit/${notif.taskId._id || notif.taskId}`}
                        className="notif-link-text"
                        onClick={() => setIsOpen(false)}
                      >
                        <span>Open Task</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </Link>
                    ) : (
                      <span />
                    )}

                    {!notif.isRead && (
                      <button
                        type="button"
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '0.72rem',
                          color: 'var(--text-muted)',
                          cursor: 'pointer'
                        }}
                        onClick={(e) => handleMarkAsRead(notif._id, e)}
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
