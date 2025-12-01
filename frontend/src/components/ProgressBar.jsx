import React from 'react';
import '../styles/animations.css';

/**
 * ProgressBar Component
 * Shows progress for async operations
 */
const ProgressBar = ({ progress = 0, indeterminate = false, label = '' }) => {
  return (
    <div style={{ width: '100%', marginBottom: '1rem' }}>
      {label && <p className="loading-text" style={{ marginBottom: '0.5rem' }}>{label}</p>}
      <div className="progress-bar-container">
        <div 
          className={`progress-bar ${indeterminate ? 'progress-bar-indeterminate' : ''}`}
          style={{ width: indeterminate ? '30%' : `${progress}%` }}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : progress}
          aria-valuemin="0"
          aria-valuemax="100"
        >
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
