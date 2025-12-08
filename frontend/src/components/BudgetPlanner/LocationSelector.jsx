/**
 * Location Selector Component
 * Cascading dropdowns for Country -> State -> City selection
 * Integrates with Budget Planner API to fetch location data
 */
import React, { useState, useEffect } from 'react';
import { getCountries } from '../../services/budgetPlannerApi';
import './LocationSelector.css';

const LocationSelector = ({ 
  value = {}, 
  onChange, 
  required = false,
  disabled = false 
}) => {
  const [countriesData, setCountriesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedCountry, setSelectedCountry] = useState(value.country || '');
  const [selectedState, setSelectedState] = useState(value.state || '');
  const [selectedCity, setSelectedCity] = useState(value.city || '');
  const [cityTier, setCityTier] = useState(value.cityTier || 'tier_1');
  const [colMultiplier, setColMultiplier] = useState(value.colMultiplier || 1.0);

  // Fetch countries data on mount
  useEffect(() => {
    const fetchCountriesData = async () => {
      try {
        setLoading(true);
        const data = await getCountries();
        // Transform API response to expected format
        // Backend returns {countries: [{code, name, ...}]}
        // We need to create a simple structure for now
        const transformedData = {
          countries: {}
        };
        
        if (data && data.countries && Array.isArray(data.countries)) {
          // For now, create a simple structure with predefined states/cities
          data.countries.forEach(country => {
            transformedData.countries[country.name] = {
              code: country.code,
              currency: country.currency,
              states: getDefaultStatesForCountry(country.name)
            };
          });
        }
        
        setCountriesData(transformedData);
        setError(null);
      } catch (err) {
        setError('Failed to load countries. Using defaults.');
        console.error('Error loading countries:', err);
        // Set fallback data
        setCountriesData({
          countries: {
            India: {
              states: {
                Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
                Karnataka: ['Bangalore', 'Mysore'],
                'Tamil Nadu': ['Chennai', 'Coimbatore'],
              }
            },
            'United States': {
              states: {
                California: ['San Francisco', 'Los Angeles', 'San Diego'],
                'New York': ['New York City', 'Buffalo'],
                Texas: ['Austin', 'Houston', 'Dallas'],
              }
            }
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCountriesData();
  }, []);
  
  // Helper function to get default states for each country
  const getDefaultStatesForCountry = (countryName) => {
    const statesMap = {
      'India': {
        'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
        'Karnataka': ['Bangalore', 'Mysore', 'Mangalore'],
        'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
        'Delhi': ['New Delhi', 'Delhi'],
        'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara'],
      },
      'United States': {
        'California': ['San Francisco', 'Los Angeles', 'San Diego'],
        'New York': ['New York City', 'Buffalo', 'Albany'],
        'Texas': ['Austin', 'Houston', 'Dallas'],
        'Washington': ['Seattle', 'Spokane'],
        'Illinois': ['Chicago', 'Springfield'],
      },
      'United Kingdom': {
        'England': ['London', 'Manchester', 'Birmingham'],
        'Scotland': ['Edinburgh', 'Glasgow'],
        'Wales': ['Cardiff'],
      },
      'Canada': {
        'Ontario': ['Toronto', 'Ottawa', 'Hamilton'],
        'British Columbia': ['Vancouver', 'Victoria'],
        'Quebec': ['Montreal', 'Quebec City'],
      },
      'Australia': {
        'New South Wales': ['Sydney', 'Newcastle'],
        'Victoria': ['Melbourne', 'Geelong'],
        'Queensland': ['Brisbane', 'Gold Coast'],
      },
    };
    
    return statesMap[countryName] || {
      'State 1': ['City 1', 'City 2'],
      'State 2': ['City 3', 'City 4'],
    };
  };

  // Get available states for selected country
  const getStates = () => {
    if (!countriesData || !selectedCountry) return [];
    const countryData = countriesData.countries?.[selectedCountry];
    return countryData?.states ? Object.keys(countryData.states) : [];
  };

  // Get available cities for selected state
  const getCities = () => {
    if (!countriesData || !selectedCountry || !selectedState) return [];
    const countryData = countriesData.countries?.[selectedCountry];
    return countryData?.states?.[selectedState] || [];
  };

  // Determine city tier and COL multiplier based on city
  const determineCityInfo = (country, city) => {
    // Tier 1 cities (high COL)
    const tier1Cities = [
      'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
      'San Francisco', 'New York City', 'Los Angeles', 'Seattle', 'Boston',
      'London', 'Manchester', 'Birmingham',
      'Toronto', 'Vancouver', 'Montreal'
    ];
    
    // Tier 2 cities (medium COL)
    const tier2Cities = [
      'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow',
      'Austin', 'Denver', 'Portland', 'Chicago',
      'Edinburgh', 'Glasgow',
      'Calgary', 'Ottawa'
    ];

    if (tier1Cities.includes(city)) {
      return { tier: 'tier_1', multiplier: 1.25 };
    } else if (tier2Cities.includes(city)) {
      return { tier: 'tier_2', multiplier: 1.05 };
    } else {
      return { tier: 'tier_3', multiplier: 0.90 };
    }
  };

  // Handle country change
  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedState('');
    setSelectedCity('');
    setCityTier('tier_1');
    setColMultiplier(1.0);
    
    onChange({
      country,
      state: '',
      city: '',
      cityTier: 'tier_1',
      colMultiplier: 1.0
    });
  };

  // Handle state change
  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity('');
    
    onChange({
      country: selectedCountry,
      state,
      city: '',
      cityTier: cityTier,
      colMultiplier: colMultiplier
    });
  };

  // Handle city change
  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    
    // Determine tier and multiplier
    const cityInfo = determineCityInfo(selectedCountry, city);
    setCityTier(cityInfo.tier);
    setColMultiplier(cityInfo.multiplier);
    
    onChange({
      country: selectedCountry,
      state: selectedState,
      city,
      cityTier: cityInfo.tier,
      colMultiplier: cityInfo.multiplier
    });
  };

  if (loading) {
    return (
      <div className="location-selector loading">
        <p>Loading locations...</p>
      </div>
    );
  }

  return (
    <div className="location-selector">
      {error && <div className="location-error">{error}</div>}
      
      <div className="location-field">
        <label htmlFor="country">
          Country {required && <span className="required">*</span>}
        </label>
        <select
          id="country"
          value={selectedCountry}
          onChange={handleCountryChange}
          disabled={disabled}
          required={required}
          className="location-select"
        >
          <option value="">Select Country</option>
          {countriesData?.countries && Object.keys(countriesData.countries).map(country => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {selectedCountry && (
        <div className="location-field">
          <label htmlFor="state">
            State/Province {required && <span className="required">*</span>}
          </label>
          <select
            id="state"
            value={selectedState}
            onChange={handleStateChange}
            disabled={disabled || !selectedCountry}
            required={required}
            className="location-select"
          >
            <option value="">Select State/Province</option>
            {getStates().map(state => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedState && (
        <div className="location-field">
          <label htmlFor="city">
            City {required && <span className="required">*</span>}
          </label>
          <select
            id="city"
            value={selectedCity}
            onChange={handleCityChange}
            disabled={disabled || !selectedState}
            required={required}
            className="location-select"
          >
            <option value="">Select City</option>
            {getCities().map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedCity && (
        <div className="city-info">
          <p className="info-text">
            <strong>City Tier:</strong> {cityTier.replace('_', ' ').toUpperCase()}
          </p>
          <p className="info-text">
            <strong>Cost of Living:</strong> {colMultiplier}x
            {colMultiplier > 1.1 ? ' (Higher)' : colMultiplier < 0.95 ? ' (Lower)' : ' (Average)'}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
