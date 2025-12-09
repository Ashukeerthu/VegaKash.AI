import React from 'react';
import { formatCurrency, calculateTripDays, getTotalTravelers } from '../travel.schema';
import './TravelSummary.css';

/**
 * Travel Budget Summary Component
 * Displays detailed budget breakdown with expense categories
 */
function TravelSummary({ travelData, budgetData, onEdit, onGenerateAI, isGenerating = false }) {
  const tripDays = calculateTripDays(travelData.startDate, travelData.endDate);
  const totalTravelers = getTotalTravelers(travelData.adults, travelData.children, travelData.infants);
  
  // Use backend data if available, otherwise show zeros
  const expenses = budgetData?.expenses || {
    flights: 0,
    accommodation: 0,
    food: 0,
    localTransport: 0,
    activities: 0,
    shopping: 0,
    visa: 0,
    insurance: 0,
    miscellaneous: 0
  };

  const subtotal = budgetData?.subtotal || 0;
  const buffer = budgetData?.buffer || 0;
  const grandTotal = budgetData?.grandTotal || 0;
  const perPersonCost = budgetData?.perPersonCost || 0;
  const perDayCost = budgetData?.perDayCost || 0;

  return (
    <div className="travel-summary">
      <div className="summary-header">
        <h2>📊 Your Travel Budget</h2>
        <p>Detailed cost breakdown for your trip</p>
      </div>

      {/* Trip Overview */}
      <section className="overview-section">
        <div className="overview-grid">
          <div className="overview-card">
            <div className="overview-icon">📍</div>
            <div className="overview-content">
              <span className="overview-label">From</span>
              <span className="overview-value">{travelData.originCity}, {travelData.originCountry}</span>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon">✈️</div>
            <div className="overview-content">
              <span className="overview-label">To</span>
              <span className="overview-value">{travelData.destinationCity}, {travelData.destinationCountry}</span>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon">📅</div>
            <div className="overview-content">
              <span className="overview-label">Duration</span>
              <span className="overview-value">{tripDays} Days</span>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon">👥</div>
            <div className="overview-content">
              <span className="overview-label">Travelers</span>
              <span className="overview-value">{totalTravelers} People</span>
            </div>
          </div>


        </div>
      </section>

      {/* Expense Breakdown */}
      <section className="expenses-section">
        <h3>💰 Expense Breakdown</h3>
        
        <div className="expense-list">
          {travelData.includeFlights && (
            <div className="expense-item">
              <div className="expense-left">
                <span className="expense-icon">✈️</span>
                <div className="expense-details">
                  <span className="expense-name">Flight Costs</span>
                  <span className="expense-description">Round-trip for {totalTravelers} travelers</span>
                </div>
              </div>
              <span className="expense-amount">{formatCurrency(expenses.flights, travelData.homeCurrency)}</span>
            </div>
          )}

          <div className="expense-item">
            <div className="expense-left">
              <span className="expense-icon">🏨</span>
              <div className="expense-details">
                <span className="expense-name">Accommodation</span>
                <span className="expense-description">{tripDays} nights, {travelData.travelStyle} style</span>
              </div>
            </div>
            <span className="expense-amount">{formatCurrency(expenses.accommodation, travelData.homeCurrency)}</span>
          </div>

          <div className="expense-item">
            <div className="expense-left">
              <span className="expense-icon">🍽️</span>
              <div className="expense-details">
                <span className="expense-name">Food & Dining</span>
                <span className="expense-description">Meals for {totalTravelers} people</span>
              </div>
            </div>
            <span className="expense-amount">{formatCurrency(expenses.food, travelData.homeCurrency)}</span>
          </div>

          <div className="expense-item">
            <div className="expense-left">
              <span className="expense-icon">🚗</span>
              <div className="expense-details">
                <span className="expense-name">Local Transport</span>
                <span className="expense-description">{travelData.localTransport}</span>
              </div>
            </div>
            <span className="expense-amount">{formatCurrency(expenses.localTransport, travelData.homeCurrency)}</span>
          </div>

          <div className="expense-item">
            <div className="expense-left">
              <span className="expense-icon">🎡</span>
              <div className="expense-details">
                <span className="expense-name">Activities & Attractions</span>
                <span className="expense-description">
                  {travelData.tripTheme.length > 0 
                    ? travelData.tripTheme.join(', ') 
                    : 'General sightseeing'}
                </span>
              </div>
            </div>
            <span className="expense-amount">{formatCurrency(expenses.activities, travelData.homeCurrency)}</span>
          </div>

          <div className="expense-item">
            <div className="expense-left">
              <span className="expense-icon">🛍️</span>
              <div className="expense-details">
                <span className="expense-name">Shopping & Souvenirs</span>
                <span className="expense-description">Estimated shopping budget</span>
              </div>
            </div>
            <span className="expense-amount">{formatCurrency(expenses.shopping, travelData.homeCurrency)}</span>
          </div>

          {travelData.includeVisa && (
            <div className="expense-item">
              <div className="expense-left">
                <span className="expense-icon">📋</span>
                <div className="expense-details">
                  <span className="expense-name">Visa Fees</span>
                  <span className="expense-description">For {totalTravelers} travelers</span>
                </div>
              </div>
              <span className="expense-amount">{formatCurrency(expenses.visa, travelData.homeCurrency)}</span>
            </div>
          )}

          {travelData.includeInsurance && (
            <div className="expense-item">
              <div className="expense-left">
                <span className="expense-icon">🛡️</span>
                <div className="expense-details">
                  <span className="expense-name">Travel Insurance</span>
                  <span className="expense-description">Coverage for {totalTravelers} people</span>
                </div>
              </div>
              <span className="expense-amount">{formatCurrency(expenses.insurance, travelData.homeCurrency)}</span>
            </div>
          )}

          <div className="expense-item">
            <div className="expense-left">
              <span className="expense-icon">💼</span>
              <div className="expense-details">
                <span className="expense-name">Miscellaneous</span>
                <span className="expense-description">Tips, emergencies, extras</span>
              </div>
            </div>
            <span className="expense-amount">{formatCurrency(expenses.miscellaneous, travelData.homeCurrency)}</span>
          </div>
        </div>

        {/* Totals */}
        <div className="totals-section">
          <div className="total-row">
            <span className="total-label">Subtotal</span>
            <span className="total-amount">{formatCurrency(subtotal, travelData.homeCurrency)}</span>
          </div>

          <div className="total-row highlight">
            <span className="total-label">Emergency Buffer ({travelData.bufferPercentage}%)</span>
            <span className="total-amount">{formatCurrency(buffer, travelData.homeCurrency)}</span>
          </div>

          <div className="total-row grand">
            <span className="total-label">Grand Total</span>
            <span className="total-amount">{formatCurrency(grandTotal, travelData.homeCurrency)}</span>
          </div>
        </div>
      </section>

      {/* Cost Insights */}
      <section className="insights-section">
        <h3>📈 Cost Insights</h3>
        
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">👤</div>
            <div className="insight-content">
              <span className="insight-label">Per Person</span>
              <span className="insight-value">{formatCurrency(perPersonCost, travelData.homeCurrency)}</span>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">📅</div>
            <div className="insight-content">
              <span className="insight-label">Per Day</span>
              <span className="insight-value">{formatCurrency(perDayCost, travelData.homeCurrency)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="summary-actions">
        <button onClick={onEdit} className="btn-secondary" disabled={isGenerating}>
          ✏️ Edit Details
        </button>
        <button onClick={onGenerateAI} className="btn-primary" disabled={isGenerating}>
          {isGenerating ? (
            <>
              <span className="spinner-small"></span>
              Generating AI Plan...
            </>
          ) : (
            <>
              🤖 Get AI Recommendations
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default TravelSummary;
