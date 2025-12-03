import React from 'react';
import PropTypes from 'prop-types';
import './PageLayout.css';

/**
 * PageLayout Component - Standard Page Container
 * 
 * @component
 * @description Production-grade page layout wrapper with consistent spacing
 * Provides standardized container, max-width, and responsive behavior
 * 
 * @example
 * <PageLayout maxWidth="lg" spacing="large">
 *   <h1>Page Title</h1>
 *   <p>Page content...</p>
 * </PageLayout>
 */
const PageLayout = ({
  children,
  maxWidth = 'xl',
  spacing = 'medium',
  className = '',
  background = 'default',
  ...rest
}) => {
  const layoutClasses = [
    'page-layout',
    `page-layout-${maxWidth}`,
    `page-layout-spacing-${spacing}`,
    `page-layout-bg-${background}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={layoutClasses} {...rest}>
      {children}
    </div>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  spacing: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  className: PropTypes.string,
  background: PropTypes.oneOf(['default', 'gray', 'gradient']),
};

export default PageLayout;
