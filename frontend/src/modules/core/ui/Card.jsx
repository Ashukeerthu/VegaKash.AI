import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

/**
 * Card Component - Industry Standard Container Component
 * 
 * @component
 * @description Production-grade card container with multiple variants and layouts
 * Used for grouping related content with consistent styling
 * 
 * @example
 * <Card variant="elevated" padding="large">
 *   <Card.Header title="EMI Calculator" subtitle="Calculate your loan EMI" />
 *   <Card.Body>
 *     // Your content here
 *   </Card.Body>
 *   <Card.Footer>
 *     <Button>Calculate</Button>
 *   </Card.Footer>
 * </Card>
 */
const Card = ({
  children,
  variant = 'elevated',
  padding = 'medium',
  rounded = 'medium',
  hoverable = false,
  className = '',
  onClick,
  ...rest
}) => {
  const cardClasses = [
    'card',
    `card-${variant}`,
    `card-padding-${padding}`,
    `card-rounded-${rounded}`,
    hoverable && 'card-hoverable',
    onClick && 'card-clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...rest}
    >
      {children}
    </div>
  );
};

/**
 * Card Header Component
 * Contains title, subtitle, and optional actions
 */
const CardHeader = ({
  title,
  subtitle,
  icon,
  actions,
  className = '',
}) => {
  return (
    <div className={`card-header ${className}`}>
      <div className="card-header-content">
        {icon && <div className="card-header-icon">{icon}</div>}
        <div className="card-header-text">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="card-header-actions">{actions}</div>}
    </div>
  );
};

/**
 * Card Body Component
 * Main content area
 */
const CardBody = ({
  children,
  className = '',
}) => {
  return (
    <div className={`card-body ${className}`}>
      {children}
    </div>
  );
};

/**
 * Card Footer Component
 * Contains actions or additional info
 */
const CardFooter = ({
  children,
  className = '',
  align = 'right',
}) => {
  return (
    <div className={`card-footer card-footer-${align} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Card Section Component
 * Divider for organizing content within card
 */
const CardSection = ({
  children,
  className = '',
  bordered = false,
}) => {
  return (
    <div className={`card-section ${bordered ? 'card-section-bordered' : ''} ${className}`}>
      {children}
    </div>
  );
};

// Attach sub-components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Section = CardSection;

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['elevated', 'outlined', 'flat', 'gradient']),
  padding: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  rounded: PropTypes.oneOf(['none', 'small', 'medium', 'large', 'full']),
  hoverable: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

CardHeader.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  icon: PropTypes.node,
  actions: PropTypes.node,
  className: PropTypes.string,
};

CardBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right', 'space-between']),
};

CardSection.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  bordered: PropTypes.bool,
};

export default Card;
