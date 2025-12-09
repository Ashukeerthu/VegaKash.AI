import React, { useState } from 'react';
import './TravelAIPlan.css';

/**
 * Travel AI Plan Component
 * Displays AI-generated trip optimization, itinerary, and recommendations
 */
function TravelAIPlan({ travelData, aiPlan, onBack, onExport }) {
  const [activeTab, setActiveTab] = useState('optimization');
  const [itineraryView, setItineraryView] = useState('sections'); // 'sections' or 'hourly'

  if (!aiPlan) {
    return (
      <div className="travel-ai-plan">
        <div className="ai-plan-header">
          <h2>🤖 AI Travel Recommendations</h2>
          <p>Loading AI insights...</p>
        </div>
        <div className="ai-loading">
          <div className="spinner"></div>
          <p>Generating personalized recommendations...</p>
        </div>
      </div>
    );
  }

  const { optimization, itinerary } = aiPlan;

  return (
    <div className="travel-ai-plan">
      <div className="ai-plan-header">
        <h2>🤖 AI Travel Recommendations</h2>
        <p>Smart optimization and personalized itinerary</p>
      </div>

      {/* Tab Navigation */}
      <div className="ai-tabs">
        <button 
          className={`ai-tab ${activeTab === 'optimization' ? 'active' : ''}`}
          onClick={() => setActiveTab('optimization')}
        >
          💰 Cost Optimization
        </button>
        <button 
          className={`ai-tab ${activeTab === 'itinerary' ? 'active' : ''}`}
          onClick={() => setActiveTab('itinerary')}
        >
          🗺️ Day-by-Day Itinerary
        </button>
      </div>

      {/* Optimization Tab */}
      {activeTab === 'optimization' && optimization && (
        <div className="ai-content">
          {/* Cost Savings Summary */}
          {optimization.savings > 0 && (
            <div className="savings-highlight">
              <div className="savings-icon">💰</div>
              <div className="savings-content">
                <h3>Potential Savings Identified</h3>
                <div className="savings-amount">
                  {travelData.homeCurrency} {optimization.savings.toLocaleString('en-US', {maximumFractionDigits: 0})}
                </div>
                <p className="savings-subtitle">
                  {optimization.savingsPercentage.toFixed(1)}% savings possible
                </p>
              </div>
            </div>
          )}

          {/* Cost Breakdown */}
          <div className="cost-comparison-card">
            <h3>💵 Cost Comparison</h3>
            <div className="cost-comparison-grid">
              <div className="cost-item">
                <span className="cost-label">Original Cost:</span>
                <span className="cost-value">{travelData.homeCurrency} {optimization.originalCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
              </div>
              <div className="cost-item optimized">
                <span className="cost-label">Optimized Cost:</span>
                <span className="cost-value">{travelData.homeCurrency} {optimization.optimizedCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
              </div>
              <div className="cost-item savings">
                <span className="cost-label">Total Savings:</span>
                <span className="cost-value highlight">{travelData.homeCurrency} {optimization.savings.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
              </div>
            </div>
          </div>

          {/* Optimization Suggestions */}
          {optimization.suggestions && optimization.suggestions.length > 0 && (
            <div className="optimization-section">
              <h3>💡 Smart Recommendations</h3>
              <div className="suggestions-grid">
                {optimization.suggestions.map((suggestion, index) => (
                  <div key={index} className={`suggestion-card priority-${suggestion.priority || 'medium'}`}>
                    <div className="suggestion-header">
                      <span className="suggestion-icon">{suggestion.icon || getSuggestionIcon(suggestion.category)}</span>
                      <span className="suggestion-category">{suggestion.category}</span>
                      {suggestion.savings > 0 && (
                        <span className="suggestion-savings">
                          Save {travelData.homeCurrency} {suggestion.savings.toLocaleString('en-US', {maximumFractionDigits: 0})}
                        </span>
                      )}
                    </div>
                    <p className="suggestion-text">{suggestion.suggestion}</p>
                    {suggestion.priority && (
                      <div className="suggestion-impact">
                        <span className="impact-label">Priority:</span>
                        <span className={`impact-badge impact-${suggestion.priority.toLowerCase()}`}>
                          {suggestion.priority}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Itinerary Tab */}
      {activeTab === 'itinerary' && itinerary && (
        <div className="ai-content">
          {/* Itinerary Summary */}
          <div className="itinerary-summary-card">
            <h3>📋 Trip Overview</h3>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Total Days:</span>
                <span className="stat-value">{itinerary.totalDays}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Activities Cost:</span>
                <span className="stat-value">{travelData.homeCurrency} {itinerary.totalCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
              </div>
            </div>
          </div>

          {/* Daily Itinerary */}
          {itinerary.itinerary && itinerary.itinerary.length > 0 && (
            <div className="daily-itinerary">
              <div className="itinerary-header">
                <h3>🗓️ Day-by-Day Plan</h3>
                
                {/* View Toggle Buttons */}
                <div className="view-toggle">
                  <button 
                    className={`view-btn ${itineraryView === 'sections' ? 'active' : ''}`}
                    onClick={() => setItineraryView('sections')}
                  >
                    📅 Morning/Afternoon/Evening
                  </button>
                  <button 
                    className={`view-btn ${itineraryView === 'hourly' ? 'active' : ''}`}
                    onClick={() => setItineraryView('hourly')}
                  >
                    ⏰ Hour-by-Hour
                  </button>
                </div>
              </div>

              {itinerary.itinerary.map((day, index) => (
                <div key={index} className="day-card">
                  <div className="day-header">
                    <div className="day-info">
                      <div className="day-number">Day {day.day}</div>
                      <div className="day-title">{day.theme || day.title || `Day ${day.day}`}</div>
                      {day.location && <div className="day-location">📍 {day.location}</div>}
                    </div>
                    {(day.estimated_cost || day.estimatedCost) && (
                      <div className="day-cost">
                        💰 {travelData.homeCurrency} {(day.estimated_cost || day.estimatedCost).toLocaleString('en-US', {maximumFractionDigits: 0})}
                      </div>
                    )}
                  </div>

                  {day.overview && (
                    <div className="day-overview">
                      <p>{day.overview}</p>
                    </div>
                  )}

                  {/* Section-Based View (Morning/Afternoon/Evening) */}
                  {itineraryView === 'sections' && day.sections && day.sections.length > 0 ? (
                    <div className="day-sections">
                      {day.sections.map((section, secIndex) => {
                        const sectionIcons = {
                          'Morning': '🌅',
                          'Afternoon': '☀️',
                          'Evening': '🌙',
                          'Night': '🌃'
                        };
                        const icon = sectionIcons[section.section] || '⏰';
                        
                        return (
                          <div key={secIndex} className={`itinerary-section section-${section.section.toLowerCase()}`}>
                            <div className="section-header">
                              <span className="section-icon">{icon}</span>
                              <h4 className="section-title">{section.section}</h4>
                              {section.title && <span className="section-subtitle">{section.title}</span>}
                              {section.cost && (
                                <span className="section-cost">
                                  💰 {travelData.homeCurrency} {section.cost.toLocaleString('en-US', {maximumFractionDigits: 0})}
                                </span>
                              )}
                            </div>

                            {section.description && (
                              <p className="section-description">{section.description}</p>
                            )}

                            {section.activities && section.activities.length > 0 && (
                              <div className="section-activities">
                                {section.activities.map((activity, actIndex) => (
                                  <div key={actIndex} className="activity-card">
                                    <div className="activity-time-block">
                                      {activity.time && <div className="activity-time">{activity.time}</div>}
                                    </div>
                                    <div className="activity-content">
                                      <h5 className="activity-title">
                                        {activity.title}
                                      </h5>
                                      {activity.description && (
                                        <p className="activity-description">{activity.description}</p>
                                      )}
                                      <div className="activity-details-grid">
                                        {activity.duration && (
                                          <span className="activity-detail">⏱️ {activity.duration}</span>
                                        )}
                                        {activity.cost && (
                                          <span className="activity-detail">
                                            💰 {travelData.homeCurrency} {activity.cost.toLocaleString('en-US', {maximumFractionDigits: 0})}
                                          </span>
                                        )}
                                      </div>

                                      {(activity.venue || activity.why_visit || activity.what_to_expect) && (
                                        <div className="activity-rich-details">
                                          {activity.venue && (
                                            <div className="detail-item">
                                              <strong>📍 Venue:</strong> {activity.venue}
                                            </div>
                                          )}
                                          {activity.why_visit && (
                                            <div className="detail-item">
                                              <strong>✨ Why Visit:</strong> {activity.why_visit}
                                            </div>
                                          )}
                                          {activity.what_to_expect && (
                                            <div className="detail-item">
                                              <strong>👀 What to Expect:</strong> {activity.what_to_expect}
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      <div className="activity-actions">
                                        {activity.booking_link && (
                                          <a href={activity.booking_link} target="_blank" rel="noopener noreferrer" className="btn-cta">
                                            🎫 Book Now
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {section.tips && section.tips.length > 0 && (
                              <div className="section-tips">
                                <strong>💡 Tips:</strong>
                                <ul>
                                  {section.tips.map((tip, tipIndex) => (
                                    <li key={tipIndex}>{tip}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : null}

                  {/* Hour-by-Hour View */}
                  {itineraryView === 'hourly' && (day.hourly_activities || day.activities) ? (
                    <div className="day-hourly">
                      {(day.hourly_activities || day.activities).map((activity, actIndex) => (
                        <div key={actIndex} className="hourly-activity-item">
                          <div className="hourly-time">
                            {activity.time}
                          </div>
                          <div className="hourly-content">
                            <h5>{activity.title}</h5>
                            {activity.description && <p>{activity.description}</p>}
                            <div className="activity-meta-inline">
                              {activity.duration && <span>⏱️ {activity.duration}</span>}
                              {activity.cost && (
                                <span>💰 {travelData.homeCurrency} {activity.cost.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                              )}
                              {activity.venue && <span>📍 {activity.venue}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {/* Day Tips */}
                  {(day.tips || day.local_insights) && (day.tips?.length > 0 || day.local_insights?.length > 0) && (
                    <div className="day-tips">
                      {day.tips && day.tips.length > 0 && (
                        <div>
                          <strong>💡 Tips:</strong>
                          <ul>
                            {day.tips.map((tip, tipIndex) => (
                              <li key={tipIndex}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {day.local_insights && day.local_insights.length > 0 && (
                        <div>
                          <strong>🌍 Local Insights:</strong>
                          <ul>
                            {day.local_insights.map((insight, insightIndex) => (
                              <li key={insightIndex}>{insight}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {day.best_time && (
                    <div className="day-best-time">
                      ⏰ <strong>Best Time:</strong> {day.best_time}
                    </div>
                  )}

                  {day.must_try && day.must_try.length > 0 && (
                    <div className="day-must-try">
                      <strong>🍽️ Must Try:</strong>
                      <ul>
                        {day.must_try.map((item, mIndex) => (
                          <li key={mIndex}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Travel Tips */}
          {itinerary.travel_tips && itinerary.travel_tips.length > 0 && (
            <div className="travel-tips-section">
              <h3>💡 Essential Travel Tips</h3>
              <div className="tips-grid">
                {itinerary.travel_tips.map((tip, index) => (
                  <div key={index} className="tip-card">
                    <div className="tip-icon">{tip.icon || '💡'}</div>
                    <div className="tip-content">
                      <h4>{tip.category}</h4>
                      <p>{tip.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="ai-plan-actions">
        <button onClick={onBack} className="btn-secondary">
          ← Back to Summary
        </button>
        {onExport && (
          <button onClick={onExport} className="btn-primary">
            📥 Export Full Plan
          </button>
        )}
      </div>
    </div>
  );
}

// Helper function to get icons for different suggestion categories
function getSuggestionIcon(category) {
  const icons = {
    flights: '✈️',
    accommodation: '🏨',
    food: '🍽️',
    transport: '🚗',
    activities: '🎯',
    timing: '⏰',
    general: '💡',
  };
  return icons[category?.toLowerCase()] || '💡';
}

export default TravelAIPlan;
