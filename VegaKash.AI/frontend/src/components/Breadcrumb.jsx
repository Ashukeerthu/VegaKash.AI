import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/Breadcrumb.css';

/**
 * Breadcrumb Component
 * Displays navigation breadcrumbs for better user orientation
 * 
 * @param {Array} items - Array of breadcrumb items
 * Example: [
 *   { label: 'Home', path: '/', icon: true },
 *   { label: 'Blog', path: '/learning/blog' },
 *   { label: 'Article Title', path: null } // null path means current page
 * ]
 */
function Breadcrumb({ items = [] }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isHome = item.icon && index === 0;

          return (
            <React.Fragment key={index}>
              <li className="breadcrumb-item">
                {!isLast && item.path ? (
                  <Link to={item.path} className="breadcrumb-link">
                    {isHome && (
                      <svg className="breadcrumb-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                      </svg>
                    )}
                    {item.label}
                  </Link>
                ) : (
                  <span className="breadcrumb-current" aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast && (
                <li className="breadcrumb-separator" aria-hidden="true">›</li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
      icon: PropTypes.bool
    })
  ).isRequired
};

export default Breadcrumb;
