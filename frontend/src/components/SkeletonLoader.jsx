import React from 'react';
import '../styles/animations.css';

/**
 * SkeletonLoader Component
 * Displays skeleton placeholders while content is loading
 */
const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="skeleton skeleton-card"></div>
        );
      
      case 'text':
        return (
          <>
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="skeleton skeleton-text"></div>
            ))}
          </>
        );
      
      case 'title':
        return (
          <div className="skeleton skeleton-title"></div>
        );
      
      case 'dashboard':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="skeleton skeleton-card"></div>
            <div className="skeleton skeleton-card"></div>
            <div className="skeleton skeleton-card"></div>
          </div>
        );
      
      case 'chart':
        return (
          <div className="skeleton" style={{ height: '400px', borderRadius: '12px' }}></div>
        );
      
      default:
        return <div className="skeleton skeleton-card"></div>;
    }
  };

  return renderSkeleton();
};

export default SkeletonLoader;
