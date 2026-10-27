import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { PageLoader } from '../components/common/PageLoader';
import { Alert } from '../components/common/Alert';
import { Button } from '../components/common/Button';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete modal state
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [timeframe, setTimeframe] = useState(''); // 'today' | 'week' | 'overdue' | ''
  const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate' | 'priority' | 'createdAt_desc' | 'createdAt_asc'

  const fetchSubjects = async () => {
    try {
      const res = await apiRequest('/subjects');
      if (res.success) setSubjects(res.data);
    } catch (e) {
      console.warn('Error fetching subjects:', e.message);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (search.trim()) queryParams.append('search', search.trim());
      if (statusFilter) queryParams.append('status', statusFilter);
      if (priorityFilter) queryParams.append('priority', priorityFilter);
      if (subjectFilter) queryParams.append('subjectId', subjectFilter);
      if (timeframe) queryParams.append('timeframe', timeframe);
      if (sortBy) queryParams.append('sort', sortBy);

      const res = await apiRequest(`/tasks?${queryParams.toString()}`);
      if (res.success) {
        setTasks(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTasks();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter, priorityFilter, subjectFilter, timeframe, sortBy]);

  // CSV Export utility
  const exportToCSV = () => {
    if (tasks.length === 0) {
      alert('No tasks to export.');
      return;
    }

    const headers = ['Title', 'Subject', 'Type', 'Priority', 'Status', 'Due Date', 'Completion Date', 'Description'];

    const escapeCSV = (str) => {
      if (str === null || str === undefined) return '""';
      const formatted = String(str).replace(/"/g, '""');
      return `"${formatted}"`;
    };

    const rows = tasks.map((t) => [
      escapeCSV(t.title),
      escapeCSV(t.subjectId?.name || 'General'),
      escapeCSV(t.type),
      escapeCSV(t.priority),
      escapeCSV(t.status),
      escapeCSV(t.dueDate ? new Date(t.dueDate).toLocaleString() : ''),
      escapeCSV(t.completedAt ? new Date(t.completedAt).toLocaleString() : ''),
      escapeCSV(t.description || '')
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `student_tasks_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleToggleStatus = async (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      await apiRequest(`/tasks/${taskId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus })
      });
      fetchTasks();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      setIsDeleting(true);
      await apiRequest(`/tasks/${taskToDelete._id}`, { method: 'DELETE' });
      setTaskToDelete(null);
      fetchTasks();
    } catch (err) {
      alert(err.message || 'Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDueDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">All Tasks & Assignments</h1>
          <p className="page-description">Filter, manage, track, and complete your academic workloads.</p>
        </div>
        <div className="page-actions">
          <Button variant="outline" onClick={exportToCSV} title="Export your tasks to CSV">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export CSV</span>
          </Button>
          <Link to="/tasks/new">
            <Button variant="primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add Task</span>
            </Button>
          </Link>
        </div>
      </header>

      <Alert type="error" message={error} />

      {/* Quick Timeframe Filter Pills */}
      <div className="quick-filter-pills">
        <button
          type="button"
          className={`filter-pill ${timeframe === '' ? 'active' : ''}`}
          onClick={() => setTimeframe('')}
        >
          All Tasks
        </button>
        <button
          type="button"
          className={`filter-pill ${timeframe === 'today' ? 'active' : ''}`}
          onClick={() => setTimeframe('today')}
        >
          Due Today
        </button>
        <button
          type="button"
          className={`filter-pill ${timeframe === 'week' ? 'active' : ''}`}
          onClick={() => setTimeframe('week')}
        >
          Due This Week
        </button>
        <button
          type="button"
          className={`filter-pill ${timeframe === 'overdue' ? 'active' : ''}`}
          onClick={() => setTimeframe('overdue')}
        >
          Overdue
        </button>
      </div>

      {/* Toolbar & Filters */}
      <div className="toolbar-container">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search assignments or descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            title="Sort tasks by"
          >
            <option value="dueDate">Sort: Closest Due Date</option>
            <option value="dueDate_desc">Sort: Latest Due Date</option>
            <option value="priority">Sort: Highest Priority</option>
            <option value="createdAt_desc">Sort: Newest First</option>
            <option value="createdAt_asc">Sort: Oldest First</option>
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
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

          {(search || statusFilter || priorityFilter || subjectFilter || timeframe || sortBy !== 'dueDate') && (
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              onClick={() => {
                setSearch('');
                setStatusFilter('');
                setPriorityFilter('');
                setSubjectFilter('');
                setTimeframe('');
                setSortBy('dueDate');
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <PageLoader text="Filtering tasks..." />
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2H2v20h20V12" />
            <path d="m9 11 3 3L22 4" />
          </svg>
          <h3 className="empty-state-title">No assignments found</h3>
          <p className="empty-state-desc">
            {search || statusFilter || priorityFilter || subjectFilter
              ? 'No tasks match your selected filter criteria. Try resetting your filters.'
              : 'You have not added any tasks yet. Create your first assignment to get organized!'}
          </p>
          <Link to="/tasks/new">
            <Button variant="primary">Add Assignment</Button>
          </Link>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`task-card ${task.status === 'Completed' ? 'task-completed' : ''}`}
            >
              <div className="task-left">
                <input
                  type="checkbox"
                  className="status-checkbox"
                  checked={task.status === 'Completed'}
                  onChange={() => handleToggleStatus(task._id, task.status)}
                  title="Toggle task completion"
                />
                <div className="task-content">
                  <span className="task-title" title={task.title}>{task.title}</span>
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
                    <span className={`badge badge-status-${task.status.replace(' ', '')}`}>
                      {task.status}
                    </span>
                    <span>Due: {formatDueDate(task.dueDate)}</span>
                    <span>• {task.type}</span>
                  </div>
                </div>
              </div>

              <div className="task-right">
                <Link to={`/tasks/edit/${task._id}`}>
                  <button type="button" className="icon-action-btn" title="Edit Task" aria-label="Edit Task">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                </Link>

                <button
                  type="button"
                  className="icon-action-btn delete"
                  onClick={() => setTaskToDelete(task)}
                  title="Delete Task"
                  aria-label="Delete Task"
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
        title="Delete Assignment"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteTask}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
};
