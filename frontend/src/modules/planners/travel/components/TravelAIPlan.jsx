import React, { useEffect, useState } from 'react';
import './TravelAIPlan.css';
import { formatCurrency } from '../travel.schema';
import ItineraryPagination from './ItineraryPagination';
import { getPlaceDetails } from '../../../../services/api';

/**
 * Smart Itinerary Mode Thresholds
 * - 1-21 days: Full detailed day-by-day itinerary
 * - 22-90 days: Weekly overview with expandable weeks
 * - 91-365 days: Monthly/region-level summary
 */
const ITINERARY_THRESHOLDS = {
  DETAILED_MAX: 21,
  WEEKLY_MAX: 90,
  MONTHLY_MAX: 365,
};

/**
 * Get itinerary display mode based on trip length
 */
const getItineraryMode = (totalDays) => {
  if (totalDays <= ITINERARY_THRESHOLDS.DETAILED_MAX) return 'detailed';
  if (totalDays <= ITINERARY_THRESHOLDS.WEEKLY_MAX) return 'weekly';
  return 'monthly';
};

/**
 * Group days into weeks
 */
const groupDaysByWeek = (days) => {
  if (!days || days.length === 0) return [];
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    const weekDays = days.slice(i, i + 7);
    const weekNum = Math.floor(i / 7) + 1;
    const locations = [...new Set(weekDays.map(d => d.location || d.city).filter(Boolean))];
    const totalCost = weekDays.reduce((sum, d) => sum + (d.estimated_cost || d.estimatedCost || 0), 0);
    // Count activities across all days in the week
    const activityCount = weekDays.reduce((sum, d) => {
      const sectionActivities = d.sections?.reduce((s, sec) => s + (sec.activities?.length || 0), 0) || 0;
      const hourlyActivities = d.hourly_activities?.length || d.activities?.length || 0;
      return sum + Math.max(sectionActivities, hourlyActivities, 1); // At least 1 activity per day
    }, 0);
    weeks.push({
      weekNumber: weekNum,
      startDay: i + 1,
      endDay: Math.min(i + 7, days.length),
      days: weekDays,
      locations,
      totalCost,
      activityCount,
      highlights: weekDays.slice(0, 3).map(d => d.theme || d.title || `Day ${d.day}`),
    });
  }
  return weeks;
};

/**
 * Group days into months
 */
const groupDaysByMonth = (days) => {
  if (!days || days.length === 0) return [];
  const months = [];
  for (let i = 0; i < days.length; i += 30) {
    const monthDays = days.slice(i, i + 30);
    const monthNum = Math.floor(i / 30) + 1;
    const locations = [...new Set(monthDays.map(d => d.location || d.city).filter(Boolean))];
    const totalCost = monthDays.reduce((sum, d) => sum + (d.estimated_cost || d.estimatedCost || 0), 0);
    months.push({
      monthNumber: monthNum,
      startDay: i + 1,
      endDay: Math.min(i + 30, days.length),
      days: monthDays,
      locations,
      totalCost,
      regions: locations.slice(0, 5),
    });
  }
  return months;
};

/**
 * Travel AI Plan Component
 * Displays AI-generated trip optimization, itinerary, and recommendations
 */
function TravelAIPlan({ travelData, aiPlan, onBack, onExport }) {
  const [activeTab, setActiveTab] = useState('optimization');
  const [itineraryView, setItineraryView] = useState('sections'); // 'sections' or 'hourly'
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllDays, setShowAllDays] = useState(false);
  const [placeDetails, setPlaceDetails] = useState({});
  const [loadingPlaces, setLoadingPlaces] = useState({});
  const [expandedWeek, setExpandedWeek] = useState(null); // For weekly mode drill-down
  const [expandedMonth, setExpandedMonth] = useState(null); // For monthly mode drill-down
  const DAYS_PER_PAGE = 7;
  const WEEKS_PER_PAGE = 4; // For weekly overview pagination
  const PLACEHOLDER_IMAGE = '/assets/images/place-placeholder.png';

  const formatCost = (value) => formatCurrency(value || 0, travelData?.homeCurrency || 'USD');

  const getPlaceQuery = (day) => day?.location || day?.city || day?.title || day?.theme || null;

  const handleImageError = (event) => {
    event.target.onerror = null;
    event.target.src = PLACEHOLDER_IMAGE;
  };

  // Helper to toggle between paged and full views while keeping page index in range
  const handleToggleShowAll = (value, totalPages) => {
    setShowAllDays(value);
    if (!value) {
      setCurrentPage((prev) => Math.min(prev, Math.max(totalPages, 1)));
    }
  };

  // Helper function to get visible days based on pagination state
  const getVisibleDays = (allDays) => {
    if (!allDays || allDays.length === 0) return [];

    // If trip is short (≤7 days) or showing all days, return all
    if (allDays.length <= DAYS_PER_PAGE || showAllDays) {
      return allDays;
    }

    // Otherwise, return only the days for the current page
    const startIdx = (currentPage - 1) * DAYS_PER_PAGE;
    const endIdx = startIdx + DAYS_PER_PAGE;
    return allDays.slice(startIdx, endIdx);
  };

  // Always compute these so hook order stays consistent; guard downstream when aiPlan is missing
  const { optimization, itinerary } = aiPlan || {};
  const totalDays = itinerary?.totalDays || itinerary?.itinerary?.length || 0;
  const totalPages = Math.max(Math.ceil(totalDays / DAYS_PER_PAGE), 1);
  
  // Smart itinerary mode based on trip length
  const itineraryMode = getItineraryMode(totalDays);
  const weeklyGroups = itineraryMode === 'weekly' ? groupDaysByWeek(itinerary?.itinerary) : [];
  const monthlyGroups = itineraryMode === 'monthly' ? groupDaysByMonth(itinerary?.itinerary) : [];
  
  // Pagination for weekly view
  const totalWeekPages = Math.ceil(weeklyGroups.length / WEEKS_PER_PAGE);
  const visibleWeeks = showAllDays 
    ? weeklyGroups 
    : weeklyGroups.slice((currentPage - 1) * WEEKS_PER_PAGE, currentPage * WEEKS_PER_PAGE);
  
  // For detailed mode or when drilling into a week/month
  const getDaysToShow = () => {
    if (itineraryMode === 'detailed') {
      return getVisibleDays(itinerary?.itinerary);
    }
    if (itineraryMode === 'weekly' && expandedWeek !== null) {
      const week = weeklyGroups.find(w => w.weekNumber === expandedWeek);
      return week ? week.days : [];
    }
    if (itineraryMode === 'monthly' && expandedMonth !== null) {
      const month = monthlyGroups.find(m => m.monthNumber === expandedMonth);
      return month ? month.days : [];
    }
    return [];
  };
  
  const visibleDays = getDaysToShow();

  useEffect(() => {
    const fetchPlaces = async () => {
      if (!visibleDays || visibleDays.length === 0 || !aiPlan) return;

      const queries = visibleDays
        .map((day) => getPlaceQuery(day))
        .filter((q) => q && q.trim().length > 0);

      const unique = Array.from(new Set(queries));
      const pending = unique.filter((q) => !placeDetails[q] && !loadingPlaces[q]);
      if (pending.length === 0) return;

      setLoadingPlaces((prev) => ({ ...prev, ...Object.fromEntries(pending.map((q) => [q, true])) }));

      for (const query of pending) {
        const details = await getPlaceDetails(query);
        const safeDetails = details || {
          place_name: query,
          image_url: PLACEHOLDER_IMAGE,
          map_static_url: PLACEHOLDER_IMAGE,
          map_embed_url: '',
          latitude: 0,
          longitude: 0,
        };

        setPlaceDetails((prev) => ({ ...prev, [query]: safeDetails }));
        setLoadingPlaces((prev) => {
          const next = { ...prev };
          delete next[query];
          return next;
        });
      }
    };

    fetchPlaces();
  }, [aiPlan, visibleDays, placeDetails, loadingPlaces]);

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
                    {formatCost(optimization.savings)}
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
                <span className="cost-value">{formatCost(optimization.originalCost)}</span>
              </div>
              <div className="cost-item optimized">
                <span className="cost-label">Optimized Cost:</span>
                <span className="cost-value">{formatCost(optimization.optimizedCost)}</span>
              </div>
              <div className="cost-item savings">
                <span className="cost-label">Total Savings:</span>
                <span className="cost-value highlight">{formatCost(optimization.savings)}</span>
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
                          Save {formatCost(suggestion.savings)}
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
                <span className="stat-value">{formatCost(itinerary.totalCost)}</span>
              </div>
            </div>
          </div>

          {/* Daily Itinerary */}
          {itinerary.itinerary && itinerary.itinerary.length > 0 && (
            <div className="daily-itinerary">
              <div className="itinerary-header">
                <h3>🗓️ {itineraryMode === 'detailed' ? 'Day-by-Day Plan' : 
                         itineraryMode === 'weekly' ? 'Weekly Overview' : 'Monthly Overview'}</h3>
                
                {/* Smart Mode Notice */}
                {itineraryMode !== 'detailed' && (
                  <div className="smart-mode-notice">
                    <span className="notice-icon">🧠</span>
                    <span className="notice-text">
                      {itineraryMode === 'weekly' 
                        ? `${totalDays}-day trip → Showing weekly summaries. Click to expand any week.`
                        : `${totalDays}-day trip → Showing monthly/region highlights.`}
                    </span>
                  </div>
                )}
                
                {/* View Toggle Buttons - Only show for detailed mode */}
                {itineraryMode === 'detailed' && (
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
                )}
              </div>

              {/* Weekly Overview Mode */}
              {itineraryMode === 'weekly' && (
                <div className="weekly-overview">
                  {visibleWeeks.map((week) => (
                    <div 
                      key={week.weekNumber} 
                      className={`week-card ${expandedWeek === week.weekNumber ? 'expanded' : ''}`}
                    >
                      <div 
                        className="week-header"
                        onClick={() => setExpandedWeek(expandedWeek === week.weekNumber ? null : week.weekNumber)}
                      >
                        <div className="week-info">
                          <h4 className="week-title">📅 Week {week.weekNumber}</h4>
                          <span className="week-days">Days {week.startDay} - {week.endDay}</span>
                        </div>
                        <div className="week-summary">
                          <span className="week-locations">
                            📍 {week.locations.slice(0, 3).join(', ')}
                            {week.locations.length > 3 && ` +${week.locations.length - 3} more`}
                          </span>
                          <span className="week-activities">{week.activityCount} activities</span>
                        </div>
                        <div className="week-expand-icon">
                          {expandedWeek === week.weekNumber ? '▼' : '▶'}
                        </div>
                      </div>

                      {/* Expanded Week Details */}
                      {expandedWeek === week.weekNumber && (
                        <div className="week-details">
                          {week.days.map((day, idx) => (
                            <div key={idx} className="week-day-summary">
                              <span className="day-badge">Day {day.day}</span>
                              <span className="day-theme">{day.theme || day.title || `Day ${day.day}`}</span>
                              {day.location && <span className="day-loc">📍 {day.location}</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Week Pagination */}
                  {weeklyGroups.length > WEEKS_PER_PAGE && !showAllDays && (
                    <div className="week-pagination">
                      <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="page-btn"
                      >
                        ◀ Prev
                      </button>
                      <span className="page-info">
                        Page {currentPage} of {totalWeekPages}
                      </span>
                      <button 
                        onClick={() => setCurrentPage(p => Math.min(totalWeekPages, p + 1))}
                        disabled={currentPage >= totalWeekPages}
                        className="page-btn"
                      >
                        Next ▶
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Monthly Overview Mode */}
              {itineraryMode === 'monthly' && (
                <div className="monthly-overview">
                  <div className="monthly-notice">
                    <h4>🌍 Extended Journey Overview</h4>
                    <p>Your {totalDays}-day adventure covers multiple regions and experiences.</p>
                  </div>
                  
                  {/* Group by approximate months */}
                  {Array.from({ length: Math.ceil(totalDays / 30) }, (_, monthIdx) => {
                    const monthStart = monthIdx * 30 + 1;
                    const monthEnd = Math.min((monthIdx + 1) * 30, totalDays);
                    const monthDays = itinerary.itinerary.filter(d => d.day >= monthStart && d.day <= monthEnd);
                    const monthLocations = [...new Set(monthDays.map(d => d.location).filter(Boolean))];
                    
                    return (
                      <div key={monthIdx} className="month-card">
                        <div className="month-header">
                          <h4>📆 Month {monthIdx + 1}</h4>
                          <span className="month-range">Days {monthStart} - {monthEnd}</span>
                        </div>
                        <div className="month-content">
                          <div className="month-locations">
                            <strong>Regions:</strong> {monthLocations.slice(0, 5).join(' → ')}
                            {monthLocations.length > 5 && ` +${monthLocations.length - 5} more`}
                          </div>
                          <div className="month-highlights">
                            <strong>Key Themes:</strong>
                            <ul>
                              {monthDays.slice(0, 4).map((d, i) => (
                                <li key={i}>{d.theme || d.title || `Day ${d.day} activities`}</li>
                              ))}
                              {monthDays.length > 4 && <li>...and {monthDays.length - 4} more days</li>}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Detailed Day-by-Day Mode (existing) */}
              {itineraryMode === 'detailed' && (
                <>
                  <ItineraryPagination
                    totalDays={totalDays}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    daysPerPage={DAYS_PER_PAGE}
                    showAllDays={showAllDays}
                    onToggleShowAll={(value) => handleToggleShowAll(value, totalPages)}
                  />

              {visibleDays.map((day, index) => {
                const placeQuery = getPlaceQuery(day);
                const placeInfo = placeQuery ? placeDetails[placeQuery] : null;
                const isLoadingPlace = placeQuery ? loadingPlaces[placeQuery] : false;
                const heroImage = placeInfo?.image_url || PLACEHOLDER_IMAGE;
                const mapImage = placeInfo?.map_static_url || PLACEHOLDER_IMAGE;

                return (
                  <div key={`${day.day}-${index}`} className="day-card">
                  <div className="day-header">
                    <div className="day-info">
                      <div className="day-number">Day {day.day}</div>
                      <div className="day-title">{day.theme || day.title || `Day ${day.day}`}</div>
                      {day.location && <div className="day-location">📍 {day.location}</div>}
                    </div>
                    {(day.estimated_cost || day.estimatedCost) && (
                      <div className="day-cost">
                        💰 {formatCost(day.estimated_cost || day.estimatedCost)}
                      </div>
                    )}
                  </div>

                  {day.overview && (
                    <div className="day-overview">
                      <p>{day.overview}</p>
                    </div>
                  )}

                  {/* Compact inline place chip with small thumbnail and map link */}
                  {placeQuery && (
                    <div className="place-chip">
                      {!isLoadingPlace && heroImage && heroImage !== PLACEHOLDER_IMAGE && (
                        <img
                          src={heroImage}
                          alt={placeQuery}
                          className="place-chip-thumb"
                          loading="lazy"
                          onError={handleImageError}
                        />
                      )}
                      {placeInfo?.map_embed_url ? (
                        <a
                          href={placeInfo.map_embed_url.replace('/embed/', '/search/')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="place-chip-link"
                        >
                          📍 View on Map
                        </a>
                      ) : (
                        <a
                          href={`https://www.google.com/maps/search/${encodeURIComponent(placeQuery)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="place-chip-link"
                        >
                          📍 View on Map
                        </a>
                      )}
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
                                  💰 {formatCost(section.cost)}
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
                                            💰 {formatCost(activity.cost)}
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
                                        <a
                                          href={`https://www.google.com/maps/search/${encodeURIComponent((activity.venue || activity.title) + (day.location ? ' ' + day.location : ''))}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="btn-map-link"
                                        >
                                          📍 View on Map
                                        </a>
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
                                <span>💰 {formatCost(activity.cost)}</span>
                              )}
                              {activity.venue && <span>📍 {activity.venue}</span>}
                              <a
                                href={`https://www.google.com/maps/search/${encodeURIComponent((activity.venue || activity.title) + (day.location ? ' ' + day.location : ''))}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-map-link-inline"
                              >
                                🗺️ Map
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {/* Day Tips */}
                  {(day.tips && day.tips.length > 0) || day.local_insights && (
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
                      {day.local_insights && (
                        <div>
                          <strong>🌍 Local Insights:</strong>
                          <p>{day.local_insights}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {day.best_time && (
                    <div className="day-best-time">
                      ⏰ <strong>Best Time:</strong> {day.best_time}
                    </div>
                  )}

                  {day.must_try && (
                    <div className="day-must-try">
                      <strong>🍽️ Must Try:</strong>
                      <p>{day.must_try}</p>
                    </div>
                  )}
                  </div>
                );
              })}
                </>
              )}
            </div>
          )}

          {/* Travel Tips */}
          {itinerary.travel_tips && Array.isArray(itinerary.travel_tips) && itinerary.travel_tips.length > 0 && (
            <div className="travel-tips-section">
              <h3>💡 Travel Tips</h3>
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
            📥 Export PDF
          </button>
        )}
      </div>

      {/* Social Media Sharing Section */}
      <div className="travel-share-section">
        <h4>💡 Found this helpful? Share your travel plan:</h4>
        <div className="share-buttons-travel">
          {/* Twitter/X */}
          <a
            href={`https://twitter.com/intent/tweet?text=Check out my AI-generated travel plan to ${travelData?.destinationCity}!&url=${encodeURIComponent(window.location.href)}&hashtags=AITravel,TravelPlanning,VegaKashAI`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn-icon twitter"
            title="Share on Twitter"
            aria-label="Share on Twitter"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn-icon linkedin"
            title="Share on LinkedIn"
            aria-label="Share on LinkedIn"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn-icon facebook"
            title="Share on Facebook"
            aria-label="Share on Facebook"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/?text=Check out my AI travel plan to ${travelData?.destinationCity}! ${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn-icon whatsapp"
            title="Share on WhatsApp"
            aria-label="Share on WhatsApp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </a>

          {/* Telegram */}
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=Check out my AI travel plan to ${travelData?.destinationCity}!`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn-icon telegram"
            title="Share on Telegram"
            aria-label="Share on Telegram"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </a>

          {/* Reddit */}
          <a
            href={`https://reddit.com/submit?url=${encodeURIComponent(window.location.href)}&title=My AI Travel Plan to ${travelData?.destinationCity}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn-icon reddit"
            title="Share on Reddit"
            aria-label="Share on Reddit"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
            </svg>
          </a>

          {/* Email */}
          <a
            href={`mailto:?subject=My AI Travel Plan to ${travelData?.destinationCity}&body=Check out my AI-generated travel plan: ${encodeURIComponent(window.location.href)}`}
            className="share-btn-icon email"
            title="Share via Email"
            aria-label="Share via Email"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </a>
        </div>
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
