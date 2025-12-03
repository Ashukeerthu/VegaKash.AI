import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import './Input.css';

/**
 * Input Component - Industry Standard Form Input
 * 
 * @component
 * @description Production-grade input field with validation, icons, and error states
 * Supports text, number, email, password, and other HTML5 input types
 * 
 * @example
 * <Input
 *   label="Monthly Income"
 *   type="number"
 *   placeholder="Enter your income"
 *   prefix="₹"
 *   value={income}
 *   onChange={(e) => setIncome(e.target.value)}
 *   required
 * />
 */
const Input = forwardRef(({
  label,
  type = 'text',
  name,
  value,
  placeholder,
  prefix,
  suffix,
  icon,
  error,
  helpText,
  required = false,
  disabled = false,
  readOnly = false,
  fullWidth = true,
  size = 'medium',
  onChange,
  onBlur,
  onFocus,
  className = '',
  inputClassName = '',
  ...rest
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const containerClasses = [
    'input-container',
    fullWidth && 'input-full-width',
    `input-size-${size}`,
    error && 'input-error',
    disabled && 'input-disabled',
    isFocused && 'input-focused',
    className
  ].filter(Boolean).join(' ');

  const inputClasses = [
    'input-field',
    prefix && 'input-has-prefix',
    suffix && 'input-has-suffix',
    icon && 'input-has-icon',
    inputClassName
  ].filter(Boolean).join(' ');

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={containerClasses}>
      {label && (
        <label className="input-label" htmlFor={name}>
          {label}
          {required && <span className="input-required" aria-label="required">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {icon && (
          <span className="input-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        
        {prefix && (
          <span className="input-prefix" aria-hidden="true">
            {prefix}
          </span>
        )}
        
        <input
          ref={ref}
          id={name}
          name={name}
          type={inputType}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${name}-error` : helpText ? `${name}-help` : undefined
          }
          {...rest}
        />
        
        {suffix && (
          <span className="input-suffix" aria-hidden="true">
            {suffix}
          </span>
        )}
        
        {type === 'password' && (
          <button
            type="button"
            className="input-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        )}
      </div>
      
      {error && (
        <p className="input-error-message" id={`${name}-error`} role="alert">
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="input-help-text" id={`${name}-help`}>
          {helpText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  icon: PropTypes.node,
  error: PropTypes.string,
  helpText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
};

export default Input;
