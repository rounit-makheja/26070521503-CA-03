import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/landing.css';

export const Landing = () => {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="tf-landing">
      {/* Background Lighting & Grid Canvas (Pure CSS) */}
      <div className="tf-landing-bg-canvas" aria-hidden="true">
        <div className="tf-ambient-glow-1" />
        <div className="tf-ambient-glow-2" />
        <div className="tf-ambient-glow-3" />
        <div className="tf-ambient-glow-4" />
        <div className="tf-grid-overlay" />
      </div>

      {/* Navigation Bar */}
      <header className="tf-navbar">
        <div className="tf-container">
          <div className="tf-navbar-inner">
            {/* Brand Logo */}
            <Link to="/" className="tf-brand" aria-label="TaskFlow Student Manager Home">
              <div className="tf-brand-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="m9 10 2 2 4-4" />
                </svg>
              </div>
              <div className="tf-brand-text">
                <span className="tf-brand-title">TaskFlow</span>
                <span className="tf-brand-subtitle">Student Manager</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="tf-nav-links" aria-label="Primary Navigation">
              <a href="#features" className="tf-nav-link">Features</a>
              <a href="#preview" className="tf-nav-link">Live Preview</a>
              <a href="#how-it-works" className="tf-nav-link">How It Works</a>
            </nav>

            {/* Actions / Auth Status */}
            <div className="tf-nav-actions">
              {isAuthenticated ? (
                <>
                  <div className="tf-user-badge">
                    <span className="tf-user-badge-dot" aria-hidden="true" />
                    <span>{user?.name ? user.name.split(' ')[0] : 'Student'}</span>
                  </div>
                  <Link to="/dashboard" className="tf-btn tf-btn-primary">
                    <span>Open Dashboard</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="tf-btn tf-btn-secondary">
                    Log In
                  </Link>
                  <Link to="/signup" className="tf-btn tf-btn-primary">
                    Get Started
                  </Link>
                </>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                className="tf-mobile-toggle"
                onClick={toggleMobileMenu}
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-expanded={mobileMenuOpen}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {mobileMenuOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  ) : (
                    <>
                      <line x1="4" y1="12" x2="20" y2="12" />
                      <line x1="4" y1="6" x2="20" y2="6" />
                      <line x1="4" y1="18" x2="20" y2="18" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        <div className={`tf-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#features" className="tf-mobile-nav-link" onClick={closeMobileMenu}>Features</a>
          <a href="#preview" className="tf-mobile-nav-link" onClick={closeMobileMenu}>Live Preview</a>
          <a href="#how-it-works" className="tf-mobile-nav-link" onClick={closeMobileMenu}>How It Works</a>
          <div className="tf-mobile-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="tf-btn tf-btn-primary" onClick={closeMobileMenu}>
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="tf-btn tf-btn-secondary" onClick={closeMobileMenu}>
                  Log In
                </Link>
                <Link to="/signup" className="tf-btn tf-btn-primary" onClick={closeMobileMenu}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="tf-hero" aria-labelledby="hero-heading">
        <div className="tf-container">
          <div className="tf-hero-grid">
            {/* Left Content Column */}
            <div className="tf-hero-content">
              {/* Eyebrow */}
              <div className="tf-eyebrow">
                <span className="tf-eyebrow-pulse" aria-hidden="true" />
                <span>YOUR ACADEMIC LIFE, IN SYNC</span>
              </div>

              {/* Main Headline */}
              <h1 id="hero-heading" className="tf-hero-headline">
                Own Your <span className="tf-gradient-text">Deadlines</span>.<br />
                Master Your <span className="tf-gradient-text">Momentum</span>.
              </h1>

              {/* Supporting Text */}
              <p className="tf-hero-support">
                One focused workspace for assignments, subjects, deadlines, and academic progress.
                Less chaos. More clarity.
              </p>

              {/* CTA Row */}
              <div className="tf-hero-cta-group">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="tf-btn tf-btn-primary tf-btn-lg">
                      <span>Open Dashboard</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                    <Link to="/calendar" className="tf-btn tf-btn-secondary tf-btn-lg">
                      Academic Calendar
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/signup" className="tf-btn tf-btn-primary tf-btn-lg">
                      <span>Get Started</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                    <Link to="/login" className="tf-btn tf-btn-secondary tf-btn-lg">
                      Log In
                    </Link>
                  </>
                )}
              </div>

              {/* Trust Signals */}
              <div className="tf-hero-trust">
                <div className="tf-trust-item">
                  <span className="tf-trust-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </span>
                  <span>Distraction-Free Focus</span>
                </div>
                <div className="tf-trust-item">
                  <span className="tf-trust-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </span>
                  <span>Course Velocity Insights</span>
                </div>
                <div className="tf-trust-item">
                  <span className="tf-trust-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 14 14" />
                    </svg>
                  </span>
                  <span>Smart Reminders</span>
                </div>
              </div>
            </div>

            {/* Right Visual Column — Stylized Floating Academic Dashboard Preview */}
            <div className="tf-hero-visual-wrapper" id="preview">
              <div className="tf-visual-glow" aria-hidden="true" />

              {/* Top Floating Badge */}
              <div className="tf-floating-badge tf-floating-badge-top" aria-hidden="true">
                <div className="tf-badge-icon-box velocity">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <span>94% On-Time Submission Rate</span>
              </div>

              {/* Bottom Floating Badge */}
              <div className="tf-floating-badge tf-floating-badge-bottom" aria-hidden="true">
                <div className="tf-badge-icon-box alert">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <span>Reminder: CS 301 Lab Due in 4h</span>
              </div>

              {/* Main Decorative Academic Preview Window */}
              <div className="tf-preview-window" role="region" aria-label="Interactive Academic Workspace Preview">
                {/* Window Chrome Title Bar */}
                <div className="tf-window-header">
                  <div className="tf-window-controls" aria-hidden="true">
                    <span className="tf-window-dot red" />
                    <span className="tf-window-dot yellow" />
                    <span className="tf-window-dot green" />
                  </div>
                  <div className="tf-window-title">
                    <span>TaskFlow • Academic Workspace</span>
                  </div>
                  <div className="tf-window-badge">
                    <span>Fall Semester</span>
                  </div>
                </div>

                {/* Window Content */}
                <div className="tf-window-body">
                  {/* Metric Cards Row */}
                  <div className="tf-preview-metrics">
                    <div className="tf-preview-metric-card">
                      <span className="tf-preview-metric-label">Completion</span>
                      <div className="tf-preview-metric-val">
                        <span>92%</span>
                        <span className="tf-metric-sub">↑ 8%</span>
                      </div>
                    </div>
                    <div className="tf-preview-metric-card">
                      <span className="tf-preview-metric-label">Completed</span>
                      <div className="tf-preview-metric-val">
                        <span>18</span>
                        <span className="tf-metric-sub">tasks</span>
                      </div>
                    </div>
                    <div className="tf-preview-metric-card">
                      <span className="tf-preview-metric-label">Urgent Due</span>
                      <div className="tf-preview-metric-val">
                        <span style={{ color: '#F87171' }}>3</span>
                        <span className="tf-metric-sub" style={{ color: '#F87171' }}>milestones</span>
                      </div>
                    </div>
                  </div>

                  {/* Velocity Progress Box */}
                  <div className="tf-preview-progress-box">
                    <div className="tf-preview-progress-header">
                      <span className="tf-preview-progress-title">Semester Course Velocity</span>
                      <span className="tf-preview-progress-pct">88% Target Pace</span>
                    </div>
                    <div className="tf-preview-progress-track">
                      <div className="tf-preview-progress-fill" />
                    </div>
                  </div>

                  {/* Illustrative Live Course Queue */}
                  <div className="tf-preview-tasks">
                    <div className="tf-preview-section-title">
                      <span>Priority Assignments</span>
                      <span style={{ color: '#38BDF8', fontSize: '0.68rem' }}>Live Schedule</span>
                    </div>

                    {/* Task Item 1 */}
                    <div className="tf-preview-task-item">
                      <div className="tf-preview-task-left">
                        <div className="tf-preview-checkbox done" aria-hidden="true">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <div className="tf-preview-task-details">
                          <span className="tf-preview-task-name">Distributed Consensus Paper</span>
                          <div className="tf-preview-task-meta">
                            <span className="tf-subject-pill cs">CS 301</span>
                            <span>Today • 11:59 PM</span>
                          </div>
                        </div>
                      </div>
                      <div className="tf-preview-task-right">
                        <span className="tf-deadline-chip urgent">Urgent</span>
                      </div>
                    </div>

                    {/* Task Item 2 */}
                    <div className="tf-preview-task-item">
                      <div className="tf-preview-task-left">
                        <div className="tf-preview-checkbox" aria-hidden="true" />
                        <div className="tf-preview-task-details">
                          <span className="tf-preview-task-name">Eigenvalues Problem Set</span>
                          <div className="tf-preview-task-meta">
                            <span className="tf-subject-pill math">MATH 240</span>
                            <span>Tomorrow • 5:00 PM</span>
                          </div>
                        </div>
                      </div>
                      <div className="tf-preview-task-right">
                        <span className="tf-deadline-chip soon">In 24h</span>
                      </div>
                    </div>

                    {/* Task Item 3 */}
                    <div className="tf-preview-task-item">
                      <div className="tf-preview-task-left">
                        <div className="tf-preview-checkbox" aria-hidden="true" />
                        <div className="tf-preview-task-details">
                          <span className="tf-preview-task-name">Quantum Mechanics Lab Report</span>
                          <div className="tf-preview-task-meta">
                            <span className="tf-subject-pill phys">PHYS 150</span>
                            <span>Thursday • Oct 30</span>
                          </div>
                        </div>
                      </div>
                      <div className="tf-preview-task-right">
                        <span className="tf-deadline-chip upcoming">Upcoming</span>
                      </div>
                    </div>
                  </div>

                  {/* Mini Calendar Element */}
                  <div className="tf-preview-calendar-strip" aria-label="Academic Week Calendar Strip">
                    <div className="tf-cal-day">
                      <span className="tf-cal-name">Mon</span>
                      <span className="tf-cal-num">26</span>
                    </div>
                    <div className="tf-cal-day active">
                      <span className="tf-cal-name">Tue</span>
                      <span className="tf-cal-num">27</span>
                      <span className="tf-cal-dot" />
                    </div>
                    <div className="tf-cal-day">
                      <span className="tf-cal-name">Wed</span>
                      <span className="tf-cal-num">28</span>
                      <span className="tf-cal-dot" />
                    </div>
                    <div className="tf-cal-day">
                      <span className="tf-cal-name">Thu</span>
                      <span className="tf-cal-num">29</span>
                    </div>
                    <div className="tf-cal-day">
                      <span className="tf-cal-name">Fri</span>
                      <span className="tf-cal-num">30</span>
                      <span className="tf-cal-dot" />
                    </div>
                    <div className="tf-cal-day">
                      <span className="tf-cal-name">Sat</span>
                      <span className="tf-cal-num">31</span>
                    </div>
                    <div className="tf-cal-day">
                      <span className="tf-cal-name">Sun</span>
                      <span className="tf-cal-num">01</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="tf-section" id="features" aria-labelledby="features-heading">
        <div className="tf-container">
          <div className="tf-section-header">
            <div className="tf-section-badge">Capabilities</div>
            <h2 id="features-heading" className="tf-section-title">
              Engineered for Serious <span className="tf-gradient-text">Academic Velocity</span>
            </h2>
            <p className="tf-section-desc">
              Every tool in TaskFlow is purpose-built to eliminate cognitive clutter, prevent last-minute cramming,
              and maintain continuous momentum throughout the semester.
            </p>
          </div>

          <div className="tf-features-grid">
            {/* Feature 1 */}
            <div className="tf-feature-card">
              <div className="tf-feature-icon-wrapper" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2H2v20h20V12" />
                  <path d="m9 11 3 3L22 4" />
                </svg>
              </div>
              <h3 className="tf-feature-title">Smart Task Management</h3>
              <p className="tf-feature-text">
                Structure assignments with priority weights, course associations, tags, and multi-state status tracking.
                Quickly filter by pending or in-progress states.
              </p>
              <div className="tf-feature-tag">Priority & Status Tracking</div>
            </div>

            {/* Feature 2 */}
            <div className="tf-feature-card">
              <div className="tf-feature-icon-wrapper" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className="tf-feature-title">Deadline Tracking</h3>
              <p className="tf-feature-text">
                Never miss a submission with dynamic urgency groupings for overdue, due today, tomorrow, and upcoming days.
                Visual badges highlight time-sensitive work.
              </p>
              <div className="tf-feature-tag">Timeline Categorization</div>
            </div>

            {/* Feature 3 */}
            <div className="tf-feature-card">
              <div className="tf-feature-icon-wrapper" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m16 6 4 14" />
                  <path d="M12 6v14" />
                  <path d="M8 8v12" />
                  <path d="M4 4v16" />
                </svg>
              </div>
              <h3 className="tf-feature-title">Subject-wise Progress</h3>
              <p className="tf-feature-text">
                Track individual course velocity, credit counts, and assignment completion ratios at a glance.
                Assign custom course color tags for instant visual recognition.
              </p>
              <div className="tf-feature-tag">Course Health Index</div>
            </div>

            {/* Feature 4 */}
            <div className="tf-feature-card">
              <div className="tf-feature-icon-wrapper" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M16 2v4" />
                  <path d="M8 2v4" />
                  <path d="M3 10h18" />
                </svg>
              </div>
              <h3 className="tf-feature-title">Academic Calendar</h3>
              <p className="tf-feature-text">
                Interactive monthly and daily scheduling grid mapped to your course deadlines and exam dates.
                Click any date to inspect due coursework instantly.
              </p>
              <div className="tf-feature-tag">Interactive Monthly Grid</div>
            </div>

            {/* Feature 5 */}
            <div className="tf-feature-card">
              <div className="tf-feature-icon-wrapper" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="7" height="9" x="3" y="3" rx="1" />
                  <rect width="7" height="5" x="14" y="3" rx="1" />
                  <rect width="7" height="9" x="14" y="12" rx="1" />
                  <rect width="7" height="5" x="3" y="16" rx="1" />
                </svg>
              </div>
              <h3 className="tf-feature-title">Productivity Insights</h3>
              <p className="tf-feature-text">
                Actionable metrics on completion velocity, weekly completed milestones, priority breakdowns, and workload distributions
                to help optimize study schedules.
              </p>
              <div className="tf-feature-tag">Velocity & Analytics</div>
            </div>

            {/* Feature 6 */}
            <div className="tf-feature-card">
              <div className="tf-feature-icon-wrapper" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <h3 className="tf-feature-title">In-App Reminders</h3>
              <p className="tf-feature-text">
                Intelligent notification drawer with automatic threshold warnings for imminent assignments within 24 and 48 hours,
                ensuring zero forgotten tasks.
              </p>
              <div className="tf-feature-tag">Automatic Alerting</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="tf-section tf-how-section" id="how-it-works" aria-labelledby="how-heading">
        <div className="tf-container">
          <div className="tf-section-header">
            <div className="tf-section-badge">Simple Workflow</div>
            <h2 id="how-heading" className="tf-section-title">
              Three Steps to <span className="tf-gradient-text">Academic Clarity</span>
            </h2>
            <p className="tf-section-desc">
              Get up and running in under two minutes with an interface designed specifically for university students.
            </p>
          </div>

          <div className="tf-steps-grid">
            {/* Step 1 */}
            <div className="tf-step-card">
              <div className="tf-step-number-badge">01</div>
              <h3 className="tf-step-title">Create your account</h3>
              <p className="tf-step-text">
                Sign up with your student email. Customize your academic profile with your college, degree program,
                and current semester for a tailored dashboard.
              </p>
            </div>

            {/* Step 2 */}
            <div className="tf-step-card">
              <div className="tf-step-number-badge">02</div>
              <h3 className="tf-step-title">Organize subjects and assignments</h3>
              <p className="tf-step-text">
                Add your semester courses with credit weights and distinct color tags. Log assignments, problem sets,
                and projects with target deadlines and priority weights.
              </p>
            </div>

            {/* Step 3 */}
            <div className="tf-step-card">
              <div className="tf-step-number-badge">03</div>
              <h3 className="tf-step-title">Track deadlines and progress</h3>
              <p className="tf-step-text">
                Stay on top of submissions via the unified calendar view, receive timely in-app reminder alerts,
                and monitor your weekly momentum as tasks are completed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Conversion CTA Section */}
      <section className="tf-cta-section" aria-labelledby="cta-heading">
        <div className="tf-container">
          <div className="tf-cta-box">
            <div className="tf-cta-glow" aria-hidden="true" />
            <div className="tf-cta-content">
              <h2 id="cta-heading" className="tf-cta-title">
                Ready to Master Your <span className="tf-gradient-text">Academic Momentum</span>?
              </h2>
              <p className="tf-cta-desc">
                Join focused students who eliminate submission anxiety, stay organized, and deliver top-tier assignments on time.
              </p>
              <div className="tf-cta-buttons">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="tf-btn tf-btn-primary tf-btn-lg">
                    <span>Open Student Dashboard</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                ) : (
                  <>
                    <Link to="/signup" className="tf-btn tf-btn-primary tf-btn-lg">
                      <span>Get Started Free</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                    <Link to="/login" className="tf-btn tf-btn-secondary tf-btn-lg">
                      Log In to Account
                    </Link>
                  </>
                )}
              </div>
              <div className="tf-cta-perks">
                <div className="tf-cta-perk-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Instant Student Setup</span>
                </div>
                <div className="tf-cta-perk-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Zero Ads or Clutter</span>
                </div>
                <div className="tf-cta-perk-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>100% Free for Students</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="tf-footer">
        <div className="tf-container">
          <div className="tf-footer-grid">
            <div className="tf-footer-brand-col">
              <Link to="/" className="tf-brand" aria-label="TaskFlow Home">
                <div className="tf-brand-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                    <path d="m9 10 2 2 4-4" />
                  </svg>
                </div>
                <div className="tf-brand-text">
                  <span className="tf-brand-title">TaskFlow</span>
                  <span className="tf-brand-subtitle">Student Manager</span>
                </div>
              </Link>
              <p className="tf-footer-desc">
                The modern academic task and deadline management system designed to help college students
                prioritize coursework, track velocity, and achieve consistent momentum.
              </p>
            </div>

            <div className="tf-footer-nav-col">
              <span className="tf-footer-heading">Product</span>
              <a href="#features" className="tf-footer-link">Features</a>
              <a href="#preview" className="tf-footer-link">Workspace Preview</a>
              <a href="#how-it-works" className="tf-footer-link">How It Works</a>
              {isAuthenticated ? (
                <Link to="/dashboard" className="tf-footer-link">Dashboard</Link>
              ) : (
                <Link to="/login" className="tf-footer-link">Sign In</Link>
              )}
            </div>

            <div className="tf-footer-nav-col">
              <span className="tf-footer-heading">Account & Views</span>
              <Link to="/login" className="tf-footer-link">Login</Link>
              <Link to="/signup" className="tf-footer-link">Sign Up</Link>
              <Link to="/help" className="tf-footer-link">Help & About</Link>
              {isAuthenticated && (
                <>
                  <Link to="/tasks" className="tf-footer-link">All Tasks</Link>
                  <Link to="/calendar" className="tf-footer-link">Calendar</Link>
                </>
              )}
            </div>
          </div>

          <div className="tf-footer-bottom">
            <span>© 2026 TaskFlow — Student Task Manager. All rights reserved.</span>
            <div className="tf-footer-tech-tag">
              <span>Engineered with React 19 • Node.js • Express • MongoDB</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
