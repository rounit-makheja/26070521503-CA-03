import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { PageLoader } from '../components/common/PageLoader';
import { Alert } from '../components/common/Alert';
import { Button } from '../components/common/Button';

export const UpcomingDeadlines = () => {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [priorityFilter, setPriorityFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  const fetchSubjects = async () => {
    try {
      const res = await apiRequest('/subjects');
      if (res.success) setSubjects(res.data);
    } catch (e) {
      console.warn('Failed to fetch subjects', e.message);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      // Default to non-completed tasks for deadlines
      queryParams.append('sort', 'dueDate');
      if (priorityFilter) queryParams.append('priority', priorityFilter);
      if (subjectFilter) queryParams.append('subjectId', subjectFilter);

      const res = await apiRequest(`/tasks?${queryParams.toString()}`);
      if (res.success) {
        // Filter out completed tasks so students focus on remaining deadlines
        const activeOnly = res.data.filter((t) => t.status !== 'Completed');
        setTasks(activeOnly);
      }
    } catch (err) {
      setError(err.message || 'Failed to load deadlines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [priorityFilter, subjectFilter]);

  const handleToggleStatus = async (taskId) => {
    try {
      await apiRequest(`/tasks/${taskId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'Completed' })
      });
      fetchTasks();
    } catch (err) {
      alert(err.message || 'Failed to complete task');
    }
  };

  // Group tasks into timeline categories: Overdue, Today, Tomorrow, This Week, Later
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const endOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59, 999);
  const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59, 59, 999);

  const groups = {
    overdue: [],
    today: [],
    tomorrow: [],
    thisWeek: [],
    later: []
  };

  tasks.forEach((t) => {
    const due = new Date(t.dueDate);
    if (due < now) {
      groups.overdue.push(t);
    } else if (due <= endOfToday) {
      groups.today.push(t);
    } else if (due <= endOfTomorrow) {
      groups.tomorrow.push(t);
    } else if (due <= endOfWeek) {
      groups.thisWeek.push(t);
    } else {
      groups.later.push(t);
    }
  });

  const getCountdownLabel = (dateStr) => {
    const target = new Date(dateStr).getTime();
    const current = Date.now();
    const diff = target - current;

    if (diff < 0) {
      const hoursAgo = Math.floor(Math.abs(diff) / (1000 * 60 * 60));
      if (hoursAgo < 24) return { text: `Overdue by ${hoursAgo}h`, type: 'countdown-overdue' };
      const daysAgo = Math.floor(hoursAgo / 24);
      return { text: `Overdue by ${daysAgo}d`, type: 'countdown-overdue' };
    }

    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    if (hoursLeft < 24) {
      return { text: `Due in ${hoursLeft}h`, type: 'countdown-urgent' };
    }
    const daysLeft = Math.floor(hoursLeft / 24);
    return { text: `Due in ${daysLeft} days`, type: 'countdown-normal' };
  };

  const formatDueDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderGroup = (title, items, isOverdue = false) => {
    if (items.length === 0) return null;

    return (
      <div className="deadlines-group">
        <div className="deadlines-group-header">
          <h2 className="group-title">{title}</h2>
          <span className={`group-count-pill ${isOverdue ? 'overdue-pill' : ''}`}>
            {items.length} {items.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        <div className="task-list">
          {items.map((task) => {
            const countdown = getCountdownLabel(task.dueDate);
            return (
              <div key={task._id} className="task-card">
                <div className="task-left">
                  <input
                    type="checkbox"
                    className="status-checkbox"
                    checked={false}
                    onChange={() => handleToggleStatus(task._id)}
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
                      <span className={`countdown-chip ${countdown.type}`}>
                        {countdown.text}
                      </span>
                      <span>Due: {formatDueDate(task.dueDate)}</span>
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
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Upcoming Deadlines</h1>
          <p className="page-description">Chronological urgency timeline with visual countdowns for pending assignments.</p>
        </div>
      </header>

      <Alert type="error" message={error} />

      {/* Filter toolbar */}
      <div className="toolbar-container">
        <div className="filter-group">
          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <select
            className="filter-select"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.code ? `[${s.code}] ` : ''}{s.name}
              </option>
            ))}
          </select>

          {(priorityFilter || subjectFilter) && (
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              onClick={() => {
                setPriorityFilter('');
                setSubjectFilter('');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <PageLoader text="Calculating deadline countdowns..." />
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <h3 className="empty-state-title">No pending deadlines</h3>
          <p className="empty-state-desc">You don't have any upcoming pending assignments due.</p>
          <Link to="/tasks/new">
            <Button variant="primary">Create Assignment</Button>
          </Link>
        </div>
      ) : (
        <div>
          {renderGroup('Overdue Submissions', groups.overdue, true)}
          {renderGroup('Due Today', groups.today)}
          {renderGroup('Due Tomorrow', groups.tomorrow)}
          {renderGroup('Due This Week', groups.thisWeek)}
          {renderGroup('Upcoming Later', groups.later)}
        </div>
      )}
    </div>
  );
};
