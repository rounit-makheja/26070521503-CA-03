import React from 'react';

export const AboutHelp = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">Help & Documentation</h1>
          <p className="page-description">Quick guide to getting the most out of Student Task & Assignment Manager.</p>
        </div>
      </header>

      <div className="help-faq-list">
        <div className="help-card">
          <h2 className="help-card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="var(--primary)">
              <path d="m16 6 4 14" />
              <path d="M12 6v14" />
              <path d="M8 8v12" />
              <path d="M4 4v16" />
            </svg>
            1. Setting Up Academic Subjects
          </h2>
          <p className="help-card-desc">
            Start by navigating to <strong>Subjects</strong>. Add each college course you are enrolled in this semester (e.g., Computer Networks, Operating Systems). Each subject can be assigned a distinct color badge tag, professor name, and code.
          </p>
        </div>

        <div className="help-card">
          <h2 className="help-card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="var(--primary)">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            2. Creating Tasks & Assignments
          </h2>
          <p className="help-card-desc">
            Click <strong>New Assignment</strong> to schedule tasks. Specify a deadline date and time, assignment type (Lab Record, Project, Homework, Exam Prep), and priority (High, Medium, Low). Linking tasks to a subject enables color-coded calendar views.
          </p>
        </div>

        <div className="help-card">
          <h2 className="help-card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="var(--primary)">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            3. Prioritizing via Upcoming Deadlines & Calendar
          </h2>
          <p className="help-card-desc">
            Use the <strong>Upcoming Deadlines</strong> tab for a timeline grouped by urgency (Due Today, Tomorrow, This Week). Overdue assignments are flagged in crimson with a relative countdown badge. The <strong>Academic Calendar</strong> provides a monthly grid view.
          </p>
        </div>

        <div className="help-card">
          <h2 className="help-card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="var(--primary)">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            4. Tracking Completed Assignments
          </h2>
          <p className="help-card-desc">
            Checking off an assignment automatically archives it into <strong>Completed Tasks</strong> with an exact completion timestamp. Completed assignments can be reopened at any time if you need to revisit them.
          </p>
        </div>
      </div>

      <div className="about-highlight-box">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
          About Student Task & Assignment Manager
        </h3>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
          Built specifically for college students to organize semester coursework, lab reports, team projects, and critical exam deadlines. Powered by a high-performance MERN architecture (React 19, Vite, Node.js, Express, and MongoDB).
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <span className="badge badge-priority-Low">Node.js + Express</span>
          <span className="badge badge-priority-Low">React.js + Vite</span>
          <span className="badge badge-priority-Low">MongoDB Mongoose</span>
          <span className="badge badge-priority-Low">JWT Security</span>
        </div>
      </div>
    </div>
  );
};
