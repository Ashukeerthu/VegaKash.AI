import React, { useState } from 'react';
import './InfoTooltip.css';

/**
 * InfoTooltip Component
 * Displays helpful information on hover
 */
function InfoTooltip({ title, content }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="info-tooltip-container"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="info-icon"
      >
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 7V11M8 5V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      
      {isVisible && (
        <div className="tooltip-popup">
          <div className="tooltip-title">{title}</div>
          <div className="tooltip-content">{content}</div>
        </div>
      )}
    </div>
  );
}

export default InfoTooltip;
