import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { PageLoader } from '../components/common/PageLoader';
import { Alert } from '../components/common/Alert';
import { Button } from '../components/common/Button';

export const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await apiRequest('/tasks');
        if (res.success) {
          setTasks(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToday = () => {
    setCurrentDate(new Date());
  };

  // Month name formatting
  const monthTitle = currentDate.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric'
  });

  // Calculate days for monthly grid
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      month: month - 1,
      year: month === 0 ? year - 1 : year,
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      month: month,
      year: year,
      isCurrentMonth: true
    });
  }

  // Next month leading days to complete grid (multiples of 7)
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({
      day: i,
      month: month + 1,
      year: month === 11 ? year + 1 : year,
      isCurrentMonth: false
    });
  }

  const today = new Date();
  const isToday = (d, m, y) => {
    return (
      d === today.getDate() &&
      m === today.getMonth() &&
      y === today.getFullYear()
    );
  };

  // Group tasks by date string YYYY-MM-DD
  const tasksByDate = {};
  tasks.forEach((t) => {
    if (!t.dueDate) return;
    const d = new Date(t.dueDate);
    const dateKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!tasksByDate[dateKey]) tasksByDate[dateKey] = [];
    tasksByDate[dateKey].push(t);
  });

  const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) return <PageLoader text="Loading academic calendar..." />;

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Academic Calendar</h1>
          <p className="page-description">Monthly view of assignment deadlines, exams, and project submissions.</p>
        </div>
        <div className="page-actions">
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

      <div className="calendar-container">
        <div className="calendar-header-bar">
          <h2 className="calendar-month-title">{monthTitle}</h2>
          <div className="calendar-nav-controls">
            <button type="button" className="btn btn-outline" onClick={prevMonth} aria-label="Previous Month">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button type="button" className="btn btn-outline" onClick={goToday}>
              Today
            </button>
            <button type="button" className="btn btn-outline" onClick={nextMonth} aria-label="Next Month">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          {weekDayNames.map((w) => (
            <div key={w} className="calendar-day-header">
              {w}
            </div>
          ))}

          {calendarDays.map((cell, idx) => {
            const dateKey = `${cell.year}-${cell.month}-${cell.day}`;
            const dayTasks = tasksByDate[dateKey] || [];
            const isCurrentDay = isToday(cell.day, cell.month, cell.year);

            return (
              <div
                key={idx}
                className={`calendar-cell ${!cell.isCurrentMonth ? 'other-month' : ''} ${isCurrentDay ? 'is-today' : ''}`}
              >
                <div className="calendar-cell-top">
                  <span className="day-number">{cell.day}</span>
                  {dayTasks.length > 0 && (
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                    </span>
                  )}
                </div>

                <div className="day-tasks-list">
                  {dayTasks.map((t) => {
                    const bgColor = t.subjectId?.color || '#4F46E5';
                    return (
                      <Link
                        key={t._id}
                        to={`/tasks/edit/${t._id}`}
                        className="calendar-task-pill"
                        style={{
                          backgroundColor: `${bgColor}18`,
                          color: bgColor,
                          borderLeft: `3px solid ${bgColor}`
                        }}
                        title={`${t.title} (${t.status})`}
                      >
                        {t.status === 'Completed' ? '✓ ' : ''}{t.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
