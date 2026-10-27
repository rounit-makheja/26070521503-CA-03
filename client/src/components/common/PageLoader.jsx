import React from 'react';

export const PageLoader = ({ text = 'Loading your workspace...' }) => {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <div className="spinner-icon" />
      <span className="page-loader-text">{text}</span>
    </div>
  );
};
