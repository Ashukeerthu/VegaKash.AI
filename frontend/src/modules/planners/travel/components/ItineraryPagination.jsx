import React, { useMemo } from 'react';
import './ItineraryPagination.css';

/**
 * Itinerary Pagination Component
 * Handles pagination and navigation for long trips (15+ days)
 * Provides week-by-week navigation and quick jump controls
 */
function ItineraryPagination({
  totalDays,
  currentPage,
  onPageChange,
  daysPerPage = 7,
  showAllDays = false,
  onToggleShowAll
}) {
  // Calculate pagination details
  const totalPages = Math.ceil(totalDays / daysPerPage);
  const startDay = (currentPage - 1) * daysPerPage + 1;
  const endDay = Math.min(currentPage * daysPerPage, totalDays);

  // Generate week number information
  const weekInfo = useMemo(() => {
    const weeks = [];
    for (let i = 1; i <= totalPages; i++) {
      weeks.push({
        page: i,
        startDay: (i - 1) * daysPerPage + 1,
        endDay: Math.min(i * daysPerPage, totalDays),
        label: `Week ${i}`
      });
    }
    return weeks;
  }, [totalDays, daysPerPage, totalPages]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      // Scroll to top of itinerary
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleWeekSelect = (page) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Don't show pagination if trip is short or showing all days
  if (totalDays <= 7 || showAllDays) {
    return null;
  }

  return (
    <div className="itinerary-pagination">
      {/* Main Navigation Controls */}
      <div className="pagination-controls">
        {/* Previous Button */}
        <button
          className="pagination-btn prev-btn"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          title="View previous week"
        >
          <span className="btn-icon">←</span>
          <span className="btn-text">Previous Week</span>
        </button>

        {/* Week Counter */}
        <div className="pagination-info">
          <span className="week-counter">
            Week {currentPage} of {totalPages}
          </span>
          <span className="day-range">
            Days {startDay}-{endDay}
          </span>
        </div>

        {/* Next Button */}
        <button
          className="pagination-btn next-btn"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          title="View next week"
        >
          <span className="btn-text">Next Week</span>
          <span className="btn-icon">→</span>
        </button>
      </div>

      {/* Quick Week Jump Controls */}
      {totalPages <= 6 ? (
        // Show individual week buttons for trips up to 6 weeks
        <div className="pagination-quick-jump">
          <span className="quick-jump-label">Jump to week:</span>
          <div className="week-buttons">
            {weekInfo.map((week) => (
              <button
                key={week.page}
                className={`week-btn ${currentPage === week.page ? 'active' : ''}`}
                onClick={() => handleWeekSelect(week.page)}
                title={`Days ${week.startDay}-${week.endDay}`}
              >
                {week.page}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Show dropdown for trips longer than 6 weeks
        <div className="pagination-dropdown">
          <label htmlFor="week-select" className="dropdown-label">Jump to week:</label>
          <select
            id="week-select"
            className="week-dropdown"
            value={currentPage}
            onChange={(e) => handleWeekSelect(parseInt(e.target.value))}
          >
            {weekInfo.map((week) => (
              <option key={week.page} value={week.page}>
                {week.label} (Days {week.startDay}-{week.endDay})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* View All Days Toggle */}
      {totalDays > 14 && (
        <div className="pagination-view-all">
          <button
            className={`view-all-btn ${showAllDays ? 'active' : ''}`}
            onClick={() => onToggleShowAll(!showAllDays)}
            title={showAllDays ? 'Back to week view' : 'View all days at once (may be slow)'}
          >
            {showAllDays ? (
              <>
                <span className="btn-icon">⬆️</span>
                <span className="btn-text">Back to Week View</span>
              </>
            ) : (
              <>
                <span className="btn-icon">📄</span>
                <span className="btn-text">View All {totalDays} Days</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="pagination-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(endDay / totalDays) * 100}%` }}
          ></div>
        </div>
        <span className="progress-text">
          Viewing {endDay} of {totalDays} days
        </span>
      </div>
    </div>
  );
}

export default ItineraryPagination;
