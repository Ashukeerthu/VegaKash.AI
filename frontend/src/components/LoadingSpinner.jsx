import React from 'react';
import '../styles/animations.css';

/**
 * LoadingSpinner Component
 * Reusable loading spinner with different sizes and messages
 */
const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Loading...', 
  showMessage = true 
}) => {
  const sizeClass = size === 'small' ? 'loading-spinner-small' : 
                    size === 'large' ? 'loading-spinner-large' : '';

  return (
    <div className="loading-container">
      <div className={`loading-spinner ${sizeClass}`} role="status" aria-label="Loading">
        <span className="sr-only">Loading...</span>
      </div>
      {showMessage && <p className="loading-text">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
