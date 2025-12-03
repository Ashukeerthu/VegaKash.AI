import React from 'react';
import '../styles/AdsPlaceholder.css';

/**
 * AdsPlaceholder Component
 * Reserved space for Google Ads to prevent CLS (Cumulative Layout Shift).
 * Renders a fixed-size container with optional skeleton shimmer while ad loads.
 * 
 * Common IAB standard sizes:
 * - leaderboard: 728x90
 * - medium-rectangle: 300x250
 * - large-rectangle: 336x280
 * - wide-skyscraper: 160x600
 * - mobile-banner: 320x50
 * - mobile-leaderboard: 320x100
 * 
 * @param {string} size - Ad size identifier (default: 'medium-rectangle')
 * @param {string} className - Additional CSS classes
 * @param {string} id - Ad slot ID for targeting
 */
const AdsPlaceholder = ({ 
  size = 'medium-rectangle', 
  className = '', 
  id = 'ad-slot' 
}) => {
  const sizeMap = {
    'leaderboard': { width: 728, height: 90 },
    'medium-rectangle': { width: 300, height: 250 },
    'large-rectangle': { width: 336, height: 280 },
    'wide-skyscraper': { width: 160, height: 600 },
    'mobile-banner': { width: 320, height: 50 },
    'mobile-leaderboard': { width: 320, height: 100 },
  };

  const dimensions = sizeMap[size] || sizeMap['medium-rectangle'];

  return (
    <div 
      className={`ads-placeholder ads-placeholder--${size} ${className}`}
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        minWidth: `${dimensions.width}px`,
        minHeight: `${dimensions.height}px`,
      }}
      id={id}
      aria-label="Advertisement"
    >
      {/* Skeleton shimmer while ad loads */}
      <div className="ads-placeholder__shimmer">
        <div className="ads-placeholder__label">Advertisement</div>
      </div>
      
      {/* Actual ad container - Google AdSense/AdManager will populate this */}
      <div 
        className="ads-placeholder__content"
        data-ad-slot={id}
      />
    </div>
  );
};

export default AdsPlaceholder;
