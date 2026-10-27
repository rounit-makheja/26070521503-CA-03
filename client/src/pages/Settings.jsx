import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';

export const Settings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Local preferences
  const [defaultView, setDefaultView] = useState(() => localStorage.getItem('stm_pref_view') || 'dashboard');
  const [density, setDensity] = useState(() => localStorage.getItem('stm_pref_density') || 'comfortable');
  const [savedMsg, setSavedMsg] = useState('');

  const handleSavePref = (newView, newDensity) => {
    localStorage.setItem('stm_pref_view', newView);
    localStorage.setItem('stm_pref_density', newDensity);
    setDefaultView(newView);
    setDensity(newDensity);
    setSavedMsg('Preferences saved successfully.');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">Application Settings</h1>
          <p className="page-description">Configure your personal workspace preferences and session settings.</p>
        </div>
      </header>

      <Alert type="success" message={savedMsg} />

      <div className="settings-section-card">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
          Workspace Preferences
        </h2>

        <div className="settings-row">
          <div className="settings-info">
            <span className="settings-label">Default Start View</span>
            <span className="settings-desc">Choose which view appears after logging into your account.</span>
          </div>
          <select
            className="filter-select"
            value={defaultView}
            onChange={(e) => handleSavePref(e.target.value, density)}
          >
            <option value="dashboard">Dashboard Overview</option>
            <option value="tasks">All Tasks</option>
            <option value="calendar">Academic Calendar</option>
            <option value="deadlines">Upcoming Deadlines</option>
          </select>
        </div>

        <div className="settings-row">
          <div className="settings-info">
            <span className="settings-label">Interface Layout Density</span>
            <span className="settings-desc">Compact spacing vs standard comfortable spacing.</span>
          </div>
          <select
            className="filter-select"
            value={density}
            onChange={(e) => handleSavePref(defaultView, e.target.value)}
          >
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </select>
        </div>
      </div>

      <div className="settings-section-card">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
          Security & Session
        </h2>

        <div className="settings-row">
          <div className="settings-info">
            <span className="settings-label">Current Authentication Session</span>
            <span className="settings-desc">Secure JSON Web Token is stored in your local browser storage.</span>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
