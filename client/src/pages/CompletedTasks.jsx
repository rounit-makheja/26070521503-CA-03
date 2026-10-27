import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { PageLoader } from '../components/common/PageLoader';
import { Alert } from '../components/common/Alert';
import { Button } from '../components/common/Button';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const CompletedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete modal state
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  const fetchSubjects = async () => {
    try {
      const res = await apiRequest('/subjects');
      if (res.success) setSubjects(res.data);
    } catch (e) {
      console.warn('Failed to load subjects', e.message);
    }
  };

  const fetchCompletedTasks = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.append('status', 'Completed');
      queryParams.append('sort', 'createdAt_desc');
      if (search.trim()) queryParams.append('search', search.trim());
      if (subjectFilter) queryParams.append('subjectId', subjectFilter);

      const res = await apiRequest(`/tasks?${queryParams.toString()}`);
      if (res.success) {
        setTasks(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load completed assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCompletedTasks();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search, subjectFilter]);

  const handleReopenTask = async (taskId) => {
    try {
      await apiRequest(`/tasks/${taskId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'Pending' })
      });
      fetchCompletedTasks();
    } catch (err) {
      alert(err.message || 'Failed to reopen task');
    }
  };

  const handleDelete = async () => {
    if (!taskToDelete) return;
    try {
      setIsDeleting(true);
      await apiRequest(`/tasks/${taskToDelete._id}`, { method: 'DELETE' });
      setTaskToDelete(null);
      fetchCompletedTasks();
    } catch (err) {
      alert(err.message || 'Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCompletedDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Completed Tasks</h1>
          <p className="page-description">History log of finished assignments, project submissions, and achievements.</p>
        </div>
      </header>

      <Alert type="error" message={error} />

      {/* Toolbar */}
      <div className="toolbar-container">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search completed assignments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
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

          {(search || subjectFilter) && (
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              onClick={() => {
                setSearch('');
                setSubjectFilter('');
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <PageLoader text="Loading completed assignments..." />
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h3 className="empty-state-title">No completed tasks found</h3>
          <p className="empty-state-desc">
            {search || subjectFilter
              ? 'No completed assignments match your search or filters.'
              : 'When you check off assignments in Dashboard or All Tasks, they will be archived here.'}
          </p>
          <Link to="/tasks">
            <Button variant="primary">Go to All Tasks</Button>
          </Link>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div key={task._id} className="task-card task-completed">
              <div className="task-left">
                <input
                  type="checkbox"
                  className="status-checkbox"
                  checked={true}
                  onChange={() => handleReopenTask(task._id)}
                  title="Click to reopen task"
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
                    <span className="badge badge-status-Completed">
                      ✓ Completed on {formatCompletedDate(task.completedAt || task.updatedAt)}
                    </span>
                    <span>• {task.type}</span>
                  </div>
                </div>
              </div>

              <div className="task-right">
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                  onClick={() => handleReopenTask(task._id)}
                  title="Reopen assignment"
                >
                  Reopen
                </button>
                <button
                  type="button"
                  className="icon-action-btn delete"
                  onClick={() => setTaskToDelete(task)}
                  title="Delete from history"
                  aria-label="Delete"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Deletion Dialog */}
      <ConfirmModal
        isOpen={Boolean(taskToDelete)}
        title="Remove From History"
        message={`Are you sure you want to permanently delete "${taskToDelete?.title}" from your completed history?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
};
