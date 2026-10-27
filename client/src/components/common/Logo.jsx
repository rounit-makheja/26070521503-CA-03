import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ to = '/' }) => {
  return (
    <Link to={to} className="app-logo" aria-label="Student Task Manager">
      <div className="logo-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
          <path d="m9 10 2 2 4-4"></path>
        </svg>
      </div>
      <div className="logo-text-group">
        <span className="logo-title">TaskFlow</span>
        <span className="logo-subtitle">Student Manager</span>
      </div>
    </Link>
  );
};
