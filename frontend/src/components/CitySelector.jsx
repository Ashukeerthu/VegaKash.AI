import React, { useState, useEffect } from 'react';
import {
  getAllCountries,
  getAllStates,
  getCitiesByState,
  getCityTier,
  getTierColor,
  TIER_DEFINITIONS
} from '../utils/cityTierData';
import '../styles/CitySelector.css';

/**
 * CitySelector Component
 * Hierarchical country → state/province → city selector with automatic tier detection
 * 
 * Features:
 * - Cascading dropdowns (Country → State → City)
 * - Auto-detect city tier and COL multiplier
 * - Manual tier selection fallback
 * - Visual tier badge with color coding
 * - Responsive design
 * 
 * @param {Object} props
 * @param {string} props.selectedCountry - Currently selected country
 * @param {string} props.selectedState - Currently selected state/province
 * @param {string} props.selectedCity - Currently selected city
 * @param {string} props.selectedTier - Currently selected tier (tier_1, tier_2, tier_3, other)
 * @param {number} props.colMultiplier - Cost of living multiplier (0.5 - 2.0)
 * @param {Function} props.onChange - Callback when selection changes
 * @param {boolean} props.disabled - Disable all inputs
 */
const CitySelector = ({
  selectedCountry = '',
  selectedState = '',
  selectedCity = '',
  selectedTier = 'other',
  colMultiplier = 1.0,
  onChange,
  disabled = false
}) => {
  const [country, setCountry] = useState(selectedCountry);
  const [state, setState] = useState(selectedState);
  const [city, setCity] = useState(selectedCity);
  const [tier, setTier] = useState(selectedTier);
  const [multiplier, setMultiplier] = useState(colMultiplier);
  const [manualTierMode, setManualTierMode] = useState(false);

  // Data sources
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Load countries on mount
  useEffect(() => {
    const allCountries = getAllCountries();
    setCountries(allCountries);
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (country) {
      const statesForCountry = getAllStates(country);
      setStates(statesForCountry);
      setState(''); // Reset state
      setCity(''); // Reset city
      setCities([]);
    } else {
      setStates([]);
      setState('');
      setCity('');
      setCities([]);
    }
  }, [country]);

  // Load cities when state changes
  useEffect(() => {
    if (country && state) {
      const citiesForState = getCitiesByState(state, country);
      setCities(citiesForState);
      setCity(''); // Reset city
    } else {
      setCities([]);
      setCity('');
    }
  }, [state, country]);

  // Auto-detect tier when city changes
  useEffect(() => {
    if (city) {
      const cityTierInfo = getCityTier(city);
      if (cityTierInfo && cityTierInfo.tier !== 'unknown') {
        setTier(cityTierInfo.tier);
        setMultiplier(cityTierInfo.multiplier);
        setManualTierMode(false);
      } else {
        // City not in database, enable manual tier selection
        setManualTierMode(true);
        setTier('other');
        setMultiplier(1.0);
      }
    } else {
      setTier('other');
      setMultiplier(1.0);
    }
  }, [city]);

  // Notify parent component of changes
  useEffect(() => {
    if (onChange) {
      onChange({
        country,
        state,
        city,
        city_tier: tier,
        col_multiplier: multiplier
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, state, city, tier, multiplier]);

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  const handleStateChange = (e) => {
    setState(e.target.value);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleManualTierChange = (e) => {
    const selectedTierKey = e.target.value;
    setTier(selectedTierKey);
    const tierDef = TIER_DEFINITIONS[selectedTierKey];
    if (tierDef) {
      setMultiplier(tierDef.multiplier);
    }
  };

  const getTierBadgeClass = (tierKey) => {
    const colors = {
      tier_1: 'tier-badge-high',
      tier_2: 'tier-badge-moderate',
      tier_3: 'tier-badge-low',
      other: 'tier-badge-default'
    };
    return colors[tierKey] || 'tier-badge-default';
  };

  return (
    <div className="city-selector-container">
      <h3 className="section-title">
        🗺️ City & Cost of Living
      </h3>

      <div className="city-selector-grid">
        {/* Country Selection */}
        <div className="form-group">
          <label htmlFor="country-select" className="form-label">
            Country <span className="required">*</span>
          </label>
          <select
            id="country-select"
            className="form-select"
            value={country}
            onChange={handleCountryChange}
            disabled={disabled}
            required
          >
            <option value="">-- Select Country --</option>
            {countries.map((countryName) => (
              <option key={countryName} value={countryName}>
                {countryName}
              </option>
            ))}
          </select>
        </div>

        {/* State/Province Selection (conditional) */}
        {country && states.length > 0 && (
          <div className="form-group">
            <label htmlFor="state-select" className="form-label">
              {country === 'United States' ? 'State' : 'Province/Region'} <span className="required">*</span>
            </label>
            <select
              id="state-select"
              className="form-select"
              value={state}
              onChange={handleStateChange}
              disabled={disabled}
              required
            >
              <option value="">-- Select {country === 'United States' ? 'State' : 'Province/Region'} --</option>
              {states.map((stateName) => (
                <option key={stateName} value={stateName}>
                  {stateName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* City Selection (conditional) */}
        {state && cities.length > 0 && (
          <div className="form-group">
            <label htmlFor="city-select" className="form-label">
              City <span className="required">*</span>
            </label>
            <select
              id="city-select"
              className="form-select"
              value={city}
              onChange={handleCityChange}
              disabled={disabled}
              required
            >
              <option value="">-- Select City --</option>
              {cities.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Manual Tier Selection (if city not in database) */}
      {manualTierMode && city && (
        <div className="form-group manual-tier-section">
          <div className="info-box">
            <i className="fas fa-info-circle"></i>
            <span>City not found in our database. Please select cost of living tier manually.</span>
          </div>
          <label htmlFor="manual-tier-select" className="form-label">
            Cost of Living Tier <span className="required">*</span>
          </label>
          <select
            id="manual-tier-select"
            className="form-select"
            value={tier}
            onChange={handleManualTierChange}
            disabled={disabled}
            required
          >
            {Object.entries(TIER_DEFINITIONS).map(([key, def]) => (
              <option key={key} value={key}>
                {def.name} (COL: {def.multiplier}x)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tier Display */}
      {(city || tier !== 'other') && (
        <div className="tier-display-section">
          <div className="tier-info-card">
            <div className="tier-header">
              <span className="tier-label">Cost of Living Tier</span>
              <span className={`tier-badge ${getTierBadgeClass(tier)}`}>
                {TIER_DEFINITIONS[tier]?.name || 'Unknown'}
              </span>
            </div>
            <div className="tier-details">
              <div className="tier-detail-item">
                <span className="detail-label">COL Multiplier:</span>
                <span className="detail-value">{multiplier.toFixed(2)}x</span>
              </div>
              <div className="tier-detail-item">
                <span className="detail-label">Description:</span>
                <span className="detail-description">
                  {TIER_DEFINITIONS[tier]?.description || 'Default cost of living'}
                </span>
              </div>
              {city && !manualTierMode && (
                <div className="tier-detail-item">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{city}, {state}, {country}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="help-text">
        <i className="fas fa-lightbulb"></i>
        <span>
          Your city's cost of living will automatically adjust your budget recommendations.
          {!city && ' Select your location to get personalized results.'}
        </span>
      </div>
    </div>
  );
};

export default CitySelector;
