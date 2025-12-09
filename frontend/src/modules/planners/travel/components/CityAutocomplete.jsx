import React, { useState, useRef, useEffect } from 'react';
import { searchCities } from '../cityData';
import './CityAutocomplete.css';

/**
 * City Autocomplete Component
 * Travel industry standard - search by city, auto-populate country
 */
function CityAutocomplete({ 
  value, 
  onChange, 
  placeholder, 
  label, 
  required, 
  error,
  touched,
  onBlur,
  id,
  name
}) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
    
    if (inputValue.length >= 2) {
      const results = searchCities(inputValue, 10);
      setSuggestions(results);
      setShowSuggestions(true);
      setHighlightedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    
    // Notify parent of change
    onChange({ city: inputValue, country: '' });
  };

  const handleSelectCity = (cityData) => {
    setQuery(cityData.city);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Notify parent with both city and country
    onChange({ 
      city: cityData.city, 
      country: cityData.country,
      code: cityData.code 
    });
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelectCity(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  const handleBlur = () => {
    // Delay to allow click on suggestion
    setTimeout(() => {
      if (onBlur) onBlur();
    }, 200);
  };

  return (
    <div className="city-autocomplete" ref={wrapperRef}>
      {label && (
        <label htmlFor={id}>
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      
      <div className="autocomplete-input-wrapper">
        <input
          type="text"
          id={id}
          name={name}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          className={touched && error ? 'error' : ''}
          autoComplete="off"
        />
        
        {query.length >= 1 && (
          <span className="search-icon">🔍</span>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((city, index) => (
            <li
              key={`${city.city}-${city.code}`}
              className={`suggestion-item ${index === highlightedIndex ? 'highlighted' : ''}`}
              onClick={() => handleSelectCity(city)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <div className="suggestion-city">
                <span className="city-icon">📍</span>
                <div className="city-info">
                  <span className="city-name">{city.city}</span>
                  <span className="city-country">{city.country}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showSuggestions && query.length >= 2 && suggestions.length === 0 && (
        <div className="no-results">
          <span>🌍 No cities found. Type manually or try another name.</span>
        </div>
      )}

      {touched && error && (
        <span className="error-message">{error}</span>
      )}
    </div>
  );
}

export default CityAutocomplete;
