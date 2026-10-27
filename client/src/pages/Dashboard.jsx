import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { PageLoader } from '../components/common/PageLoader';
import { Alert } from '../components/common/Alert';
import { Button } from '../components/common/Button';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/tasks/stats/summary');
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleToggleStatus = async (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      await apiRequest(`/tasks/${taskId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus })
      });
      fetchStats();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  if (loading) return <PageLoader text="Loading your dashboard summary..." />;

  const formatDueDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-description">Track your academic deadlines, assignments, and course velocity.</p>
        </div>
        <div className="page-actions">
          <Link to="/tasks/new">
            <Button variant="primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>New Assignment</span>
            </Button>
          </Link>
        </div>
      </header>

      <Alert type="error" message={error} />

      {/* Visual Completion Progress Bar & Weekly Productivity */}
      <div className="progress-card">
        <div className="progress-header">
          <span className="progress-title">Academic Progress & Velocity</span>
          <span className="progress-percent">{stats?.completionRate || 0}% Completed</span>
        </div>
        <div className="progress-track" role="progressbar" aria-valuenow={stats?.completionRate || 0} aria-valuemin="0" aria-valuemax="100">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(stats?.completionRate || 0, 100)}%` }}
          />
        </div>
        <div className="progress-stats-row">
          <span>{stats?.completed || 0} of {stats?.total || 0} tasks completed</span>
          <span>⚡ {stats?.completedThisWeek || 0} completed past 7 days</span>
          <span>{stats?.pending || 0} remaining ({stats?.overdue || 0} overdue)</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Total Tasks</span>
            <span className="metric-number">{stats?.total || 0}</span>
          </div>
          <div className="metric-icon-box metric-icon-indigo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2H2v20h20V12" />
              <path d="m9 11 3 3L22 4" />
            </svg>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Pending</span>
            <span className="metric-number">{stats?.pending || 0}</span>
          </div>
          <div className="metric-icon-box metric-icon-amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Overdue</span>
            <span className="metric-number">{stats?.overdue || 0}</span>
          </div>
          <div className="metric-icon-box metric-icon-rose">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Completed</span>
            <span className="metric-number">{stats?.completed || 0}</span>
          </div>
          <div className="metric-icon-box metric-icon-emerald">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>
      </div>

      {/* Urgent Deadlines Panel */}
      <section className="section-panel">
        <div className="section-panel-header">
          <h2 className="section-panel-title">Urgent Upcoming Submissions</h2>
          <Link to="/tasks" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
            View All Tasks
          </Link>
        </div>

        {(!stats?.urgentTasks || stats.urgentTasks.length === 0) ? (
          <div className="empty-state">
            <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <h3 className="empty-state-title">No pending urgent deadlines</h3>
            <p className="empty-state-desc">You are all caught up on submissions! Create a new assignment whenever your professors post tasks.</p>
            <Link to="/tasks/new">
              <Button variant="primary">Add Assignment</Button>
            </Link>
          </div>
        ) : (
          <div className="task-list">
            {stats.urgentTasks.map((task) => (
              <div key={task._id} className="task-card">
                <div className="task-left">
                  <input
                    type="checkbox"
                    className="status-checkbox"
                    checked={task.status === 'Completed'}
                    onChange={() => handleToggleStatus(task._id, task.status)}
                    title="Mark complete"
                  />
                  <div className="task-content">
                    <span className="task-title">{task.title}</span>
                    <div className="task-meta-row">
                      {task.subjectId && (
                        <span
                          className="badge badge-subject"
                          style={{ backgroundColor: task.subjectId.color || '#4F46E5' }}
                        >
                          {task.subjectId.code || task.subjectId.name}
                        </span>
                      )}
                      <span className={`badge badge-priority-${task.priority}`}>
                        {task.priority} Priority
                      </span>
                      <span>Due: {formatDueDate(task.dueDate)}</span>
                      <span>• {task.type}</span>
                    </div>
                  </div>
                </div>

                <div className="task-right">
                  <Link to={`/tasks/edit/${task._id}`}>
                    <Button variant="outline" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
