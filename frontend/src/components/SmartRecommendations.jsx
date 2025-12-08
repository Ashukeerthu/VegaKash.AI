import React, { useEffect, useState } from 'react';
import { getSmartRecommendations } from '../services/api';
import '../styles/SmartRecommendations.css';

function SmartRecommendations({ formData }) {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (formData) {
      fetchRecommendations();
    }
  }, [formData]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSmartRecommendations(formData);
      setRecommendations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!formData) {
    return null;
  }

  if (loading) {
    return (
      <div className="recommendations-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Analyzing your finances...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendations-container">
        <div className="error-state">
          <p className="error-message">⚠️ {error}</p>
          <button onClick={fetchRecommendations} className="retry-btn">
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return null;
  }

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'high':
        return 'severity-high';
      case 'medium':
        return 'severity-medium';
      case 'low':
        return 'severity-low';
      default:
        return '';
    }
  };

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <h2>💡 Smart Recommendations</h2>
        <p className="recommendations-subtitle">Personalized tips to improve your financial health</p>
      </div>

      {/* Spending Alerts */}
      {recommendations.alerts && recommendations.alerts.length > 0 && (
        <div className="alerts-section">
          <h3>⚠️ Spending Alerts</h3>
          <div className="alerts-grid">
            {recommendations.alerts.map((alert, index) => (
              <div key={index} className={`alert-card ${getSeverityClass(alert.severity)}`}>
                <div className="alert-header">
                  <span className="alert-category">{alert.category}</span>
                  <span className={`alert-severity ${getSeverityClass(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <p className="alert-message">{alert.message}</p>
                <div className="alert-suggestion">
                  <strong>💡 Suggestion:</strong> {alert.suggestion}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personalized Recommendations */}
      {recommendations.recommendations && recommendations.recommendations.length > 0 && (
        <div className="recommendations-section">
          <h3>🎯 Personalized Recommendations</h3>
          <div className="recommendations-grid">
            {recommendations.recommendations.map((rec, index) => (
              <div key={index} className="recommendation-card">
                <div className="recommendation-header">
                  <h4>{rec.title}</h4>
                  {rec.potential_savings > 0 && (
                    <span className="savings-badge">
                      Save ₹{rec.potential_savings.toLocaleString()}/month
                    </span>
                  )}
                </div>
                <p className="recommendation-description">{rec.description}</p>
                <div className="action-items">
                  <strong>Action Steps:</strong>
                  <ul>
                    {rec.action_items.map((action, idx) => (
                      <li key={idx}>{action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seasonal Reminders */}
      {recommendations.seasonal_reminders && recommendations.seasonal_reminders.length > 0 && (
        <div className="reminders-section">
          <h3 title="Coming Soon">📅 Seasonal Reminders <span className="coming-soon-tag">(Coming soon)</span></h3>
          <div className="reminders-grid">
            {recommendations.seasonal_reminders.map((reminder, index) => (
              <div key={index} className="reminder-card">
                <span className="reminder-icon">🔔</span>
                <p>{reminder}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Recommendations */}
      {recommendations.alerts.length === 0 && 
       recommendations.recommendations.length === 0 && (
        <div className="no-recommendations">
          <p>✅ Great job! Your finances are in good shape. Keep up the good work!</p>
        </div>
      )}
    </div>
  );
}

export default SmartRecommendations;
