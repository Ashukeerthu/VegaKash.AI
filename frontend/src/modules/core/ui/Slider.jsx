import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Slider.css';

/**
 * Slider Component - Industry Standard Range Input
 * 
 * @component
 * @description Production-grade slider with visual feedback, custom marks, and formatting
 * Perfect for financial calculators with amount and percentage inputs
 * 
 * @example
 * <Slider
 *   label="Loan Amount"
 *   min={100000}
 *   max={10000000}
 *   value={amount}
 *   onChange={setAmount}
 *   step={10000}
 *   prefix="₹"
 *   formatter={(val) => val.toLocaleString('en-IN')}
 * />
 */
const Slider = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  prefix,
  suffix,
  onChange,
  onBlur,
  disabled = false,
  showInput = true,
  showMarks = false,
  marks,
  formatter,
  className = '',
  name,
  ...rest
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const sliderRef = useRef(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Calculate fill percentage
  const percentage = ((value - min) / (max - min)) * 100;

  // Format display value
  const formatValue = (val) => {
    if (formatter) return formatter(val);
    return val.toLocaleString();
  };

  // Handle slider change
  const handleSliderChange = (e) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
    setInputValue(newValue);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value.replace(/[^0-9.]/g, '');
    setInputValue(newValue);
  };

  // Handle input blur - validate and update
  const handleInputBlur = () => {
    let numValue = parseFloat(inputValue) || min;
    numValue = Math.max(min, Math.min(max, numValue));
    onChange(numValue);
    setInputValue(numValue);
    onBlur?.(numValue);
  };

  // Handle input key press
  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleInputBlur();
      e.target.blur();
    }
  };

  // Generate marks if needed
  const renderMarks = () => {
    if (!showMarks && !marks) return null;

    const marksToRender = marks || [
      { value: min, label: formatValue(min) },
      { value: max, label: formatValue(max) }
    ];

    return (
      <div className="slider-marks">
        {marksToRender.map((mark, index) => {
          const markPercentage = ((mark.value - min) / (max - min)) * 100;
          return (
            <div
              key={index}
              className="slider-mark"
              style={{ left: `${markPercentage}%` }}
            >
              <div className="slider-mark-dot" />
              {mark.label && (
                <div className="slider-mark-label">{mark.label}</div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const containerClasses = [
    'slider-container',
    disabled && 'slider-disabled',
    isDragging && 'slider-dragging',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className="slider-header">
        {label && (
          <label className="slider-label" htmlFor={name}>
            {label}
          </label>
        )}
        {showInput && (
          <div className="slider-input-wrapper">
            {prefix && <span className="slider-input-prefix">{prefix}</span>}
            <input
              type="text"
              className="slider-input"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyPress={handleInputKeyPress}
              disabled={disabled}
              aria-label={`${label} value input`}
            />
            {suffix && <span className="slider-input-suffix">{suffix}</span>}
          </div>
        )}
      </div>

      <div className="slider-wrapper" ref={sliderRef}>
        <div
          className="slider-fill"
          style={{ width: `${percentage}%` }}
          aria-hidden="true"
        />
        <input
          id={name}
          type="range"
          className="slider-track"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          disabled={disabled}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${prefix || ''}${formatValue(value)}${suffix || ''}`}
          {...rest}
        />
        <div
          className="slider-thumb"
          style={{ left: `${percentage}%` }}
          aria-hidden="true"
        >
          <div className="slider-thumb-tooltip">
            {prefix}{formatValue(value)}{suffix}
          </div>
        </div>
      </div>

      {renderMarks()}

      <div className="slider-range-labels">
        <span className="slider-range-min">
          {prefix}{formatValue(min)}{suffix}
        </span>
        <span className="slider-range-max">
          {prefix}{formatValue(max)}{suffix}
        </span>
      </div>
    </div>
  );
};

Slider.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  showInput: PropTypes.bool,
  showMarks: PropTypes.bool,
  marks: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number.isRequired,
    label: PropTypes.string
  })),
  formatter: PropTypes.func,
  className: PropTypes.string,
  name: PropTypes.string,
};

export default Slider;
