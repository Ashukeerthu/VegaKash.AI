import React, { useState } from 'react';
import './Tooltip.css';

/**
 * Reusable Tooltip Component
 * Usage: <Tooltip text="Explanation here">ℹ️</Tooltip>
 */
function Tooltip({ text, children, position = 'top' }) {
  const [visible, setVisible] = useState(false);

  return (
    <span 
      className="tooltip-wrapper"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={0}
      role="tooltip"
      aria-label={text}
    >
      {children}
      {visible && (
        <span className={`tooltip-content tooltip-${position}`}>
          {text}
        </span>
      )}
    </span>
  );
}

export default Tooltip;
