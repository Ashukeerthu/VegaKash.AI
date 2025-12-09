import React, { useState } from 'react';
import {
  travelSchema,
  defaultTravelFormValues,
  validateTravelForm,
  calculateTripDays,
  getTotalTravelers
} from '../travel.schema';
import CityAutocomplete from './CityAutocomplete';
import './TravelForm.css';

/**
 * Travel Budget Form Component
 * Collects trip information, preferences, and travel details
 */
function TravelForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState(defaultTravelFormValues);
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const tripDays = calculateTripDays(formData.startDate, formData.endDate);
  const totalTravelers = getTotalTravelers(formData.adults, formData.children, formData.infants);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const handleThemeToggle = (theme) => {
    setFormData(prev => {
      const currentThemes = prev.tripTheme || [];
      const newThemes = currentThemes.includes(theme)
        ? currentThemes.filter(t => t !== theme)
        : [...currentThemes, theme];
      return { ...prev, tripTheme: newThemes };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validation = validateTravelForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setTouchedFields(
        Object.keys(validation.errors).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );
      
      // Scroll to first error
      const firstErrorField = Object.keys(validation.errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    onSubmit(formData);
  };

  return (
    <form className="travel-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>✈️ Plan Your Trip</h2>
        <p>Tell us about your travel plans and we'll create a detailed budget</p>
      </div>

      {/* Section 1: Trip Details */}
      <section className="form-section">
        <h3 className="section-title">📍 Trip Details</h3>
        
        <div className="form-subsection">
          <h4 className="subsection-title">🏠 Traveling From</h4>
          <div className="form-group">
            <CityAutocomplete
              id="originCity"
              name="originCity"
              label="Your City"
              placeholder="Search your city... (e.g., Dubai, Mumbai, London)"
              value={formData.originCity}
              onChange={(cityData) => {
                handleChange('originCity', cityData.city);
                if (cityData.country) {
                  handleChange('originCountry', cityData.country);
                }
              }}
              onBlur={() => {
                handleBlur('originCity');
                handleBlur('originCountry');
              }}
              error={errors.originCity}
              touched={touchedFields.originCity}
              required
            />
            {formData.originCountry && (
              <small className="help-text">
                <span className="auto-filled">
                  ✓ Country auto-filled: <strong>{formData.originCountry}</strong>
                </span>
              </small>
            )}
          </div>
        </div>

        <div className="form-subsection">
          <h4 className="subsection-title">✈️ Traveling To</h4>
          <div className="form-group">
            <CityAutocomplete
              id="destinationCity"
              name="destinationCity"
              label="Destination City"
              placeholder="Search destination... (e.g., Paris, Tokyo, Dubai)"
              value={formData.destinationCity}
              onChange={(cityData) => {
                handleChange('destinationCity', cityData.city);
                if (cityData.country) {
                  handleChange('destinationCountry', cityData.country);
                }
              }}
              onBlur={() => {
                handleBlur('destinationCity');
                handleBlur('destinationCountry');
              }}
              error={errors.destinationCity}
              touched={touchedFields.destinationCity}
              required
            />
            {formData.destinationCountry && (
              <small className="help-text">
                <span className="auto-filled">
                  ✓ Country auto-filled: <strong>{formData.destinationCountry}</strong>
                </span>
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="additionalDestinations">
              Additional Destinations (Optional)
            </label>
            <input
              type="text"
              id="additionalDestinations"
              name="additionalDestinations"
              value={formData.additionalDestinations}
              onChange={(e) => handleChange('additionalDestinations', e.target.value)}
              placeholder="e.g., Rome, Barcelona, Amsterdam"
            />
            <small className="help-text">Other cities in the same trip, separated by commas</small>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">
              Start Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              onBlur={() => handleBlur('startDate')}
              min={new Date().toISOString().split('T')[0]}
              className={touchedFields.startDate && errors.startDate ? 'error' : ''}
            />
            {touchedFields.startDate && errors.startDate && (
              <span className="error-message">{errors.startDate}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="endDate">
              End Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              onBlur={() => handleBlur('endDate')}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
              className={touchedFields.endDate && errors.endDate ? 'error' : ''}
            />
            {touchedFields.endDate && errors.endDate && (
              <span className="error-message">{errors.endDate}</span>
            )}
          </div>
        </div>

        {tripDays > 0 && (
          <div className="trip-info-badge">
            📅 Trip Duration: <strong>{tripDays} days</strong>
          </div>
        )}
      </section>

      {/* Section 2: Travelers */}
      <section className="form-section">
        <h3 className="section-title">👥 Travelers</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="adults">
              Adults <span className="required">*</span>
            </label>
            <input
              type="number"
              id="adults"
              name="adults"
              value={formData.adults}
              onChange={(e) => handleChange('adults', parseInt(e.target.value) || 0)}
              onBlur={() => handleBlur('adults')}
              min="1"
              max="20"
              className={touchedFields.adults && errors.adults ? 'error' : ''}
            />
            <small className="help-text">Age 18+</small>
            {touchedFields.adults && errors.adults && (
              <span className="error-message">{errors.adults}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="children">Children</label>
            <input
              type="number"
              id="children"
              name="children"
              value={formData.children}
              onChange={(e) => handleChange('children', parseInt(e.target.value) || 0)}
              min="0"
              max="10"
            />
            <small className="help-text">Age 2-17</small>
          </div>

          <div className="form-group">
            <label htmlFor="infants">Infants</label>
            <input
              type="number"
              id="infants"
              name="infants"
              value={formData.infants}
              onChange={(e) => handleChange('infants', parseInt(e.target.value) || 0)}
              min="0"
              max="5"
            />
            <small className="help-text">Age 0-2</small>
          </div>
        </div>

        {totalTravelers > 0 && (
          <div className="trip-info-badge">
            👨‍👩‍👧‍👦 Total Travelers: <strong>{totalTravelers}</strong>
          </div>
        )}
      </section>

      {/* Section 3: Travel Style */}
      <section className="form-section">
        <h3 className="section-title">✨ Travel Style</h3>
        
        <div className="radio-card-group">
          {travelSchema.travelStyle.options.map((option) => (
            <label key={option.value} className="radio-card">
              <input
                type="radio"
                name="travelStyle"
                value={option.value}
                checked={formData.travelStyle === option.value}
                onChange={(e) => handleChange('travelStyle', e.target.value)}
              />
              <div className="radio-card-content">
                <span className="radio-card-icon">{option.icon}</span>
                <span className="radio-card-label">{option.label}</span>
                <small className="radio-card-description">{option.description}</small>
              </div>
            </label>
          ))}
        </div>
        {touchedFields.travelStyle && errors.travelStyle && (
          <span className="error-message">{errors.travelStyle}</span>
        )}
      </section>

      {/* Section 4: Trip Theme */}
      <section className="form-section">
        <h3 className="section-title">🎯 Trip Theme (Optional)</h3>
        <p className="section-description">Select all that apply</p>
        
        <div className="checkbox-chip-group">
          {travelSchema.tripTheme.options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`checkbox-chip ${
                formData.tripTheme.includes(option.value) ? 'active' : ''
              }`}
              onClick={() => handleThemeToggle(option.value)}
            >
              <span className="chip-icon">{option.icon}</span>
              <span className="chip-label">{option.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Section 5: Local Transport */}
      <section className="form-section">
        <h3 className="section-title">🚗 Local Transportation</h3>
        
        <div className="radio-card-group">
          {travelSchema.localTransport.options.map((option) => (
            <label key={option.value} className="radio-card">
              <input
                type="radio"
                name="localTransport"
                value={option.value}
                checked={formData.localTransport === option.value}
                onChange={(e) => handleChange('localTransport', e.target.value)}
              />
              <div className="radio-card-content">
                <span className="radio-card-icon">{option.icon}</span>
                <span className="radio-card-label">{option.label}</span>
                <small className="radio-card-description">{option.description}</small>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Section 6: Currency & Options */}
      <section className="form-section">
        <h3 className="section-title">💰 Budget Preferences</h3>
        
        <div className="form-group">
          <label htmlFor="homeCurrency">
            Your Currency <span className="required">*</span>
          </label>
          <select
            id="homeCurrency"
            name="homeCurrency"
            value={formData.homeCurrency}
            onChange={(e) => handleChange('homeCurrency', e.target.value)}
            className={touchedFields.homeCurrency && errors.homeCurrency ? 'error' : ''}
          >
            {travelSchema.homeCurrency.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.includeFlights}
              onChange={(e) => handleChange('includeFlights', e.target.checked)}
            />
            <span>Include Flight Costs</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.includeVisa}
              onChange={(e) => handleChange('includeVisa', e.target.checked)}
            />
            <span>Include Visa Fees</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.includeInsurance}
              onChange={(e) => handleChange('includeInsurance', e.target.checked)}
            />
            <span>Include Travel Insurance</span>
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="bufferPercentage">
            Emergency Buffer: {formData.bufferPercentage}%
          </label>
          <input
            type="range"
            id="bufferPercentage"
            name="bufferPercentage"
            value={formData.bufferPercentage}
            onChange={(e) => handleChange('bufferPercentage', parseInt(e.target.value))}
            min="0"
            max="50"
            step="5"
          />
          <small className="help-text">Extra cushion for unexpected expenses</small>
        </div>
      </section>

      {/* Section 5: Itinerary Detail Level */}
      <section className="form-section">
        <h3 className="section-title">📖 Itinerary Detail Level</h3>
        <p className="section-subtitle">Choose how detailed your day-by-day plan should be. This helps optimize our AI token usage.</p>
        
        <div className="detail-level-options">
          {travelSchema.itineraryDetailLevel.options.map((option) => (
            <label key={option.value} className="detail-level-card">
              <input
                type="radio"
                name="itineraryDetailLevel"
                value={option.value}
                checked={formData.itineraryDetailLevel === option.value}
                onChange={(e) => handleChange('itineraryDetailLevel', e.target.value)}
                className="radio-input"
              />
              <div className="detail-level-content">
                <div className="detail-level-header">
                  <span className="detail-icon">{option.icon}</span>
                  <span className="detail-label">{option.label}</span>
                </div>
                <p className="detail-description">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
        {touchedFields.itineraryDetailLevel && errors.itineraryDetailLevel && (
          <span className="error-message">{errors.itineraryDetailLevel}</span>
        )}
      </section>

      {/* Submit Button */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn-submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Calculating Your Budget...
            </>
          ) : (
            <>
              🚀 Generate My Travel Budget
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default TravelForm;
