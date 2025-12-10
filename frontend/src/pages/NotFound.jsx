import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import '../styles/NotFound.css';

/**
 * 404 Not Found Page
 * Modern, responsive error page matching application theme
 * Provides navigation back to homepage and blog
 */
function NotFound() {
  return (
    <>
      <SEO 
        title="404 – Page Not Found"
        description="The page you are looking for does not exist."
        noindex={true}
      />
      
      <div className="not-found-container">
        <div className="not-found-content">
          {/* Animated 404 Background */}
          <div className="not-found-background">
            <div className="floating-shape shape-1"></div>
            <div className="floating-shape shape-2"></div>
            <div className="floating-shape shape-3"></div>
          </div>

          {/* Main Content */}
          <div className="not-found-main">
            {/* Large 404 Display */}
            <div className="not-found-number">
              <div className="number-gradient">404</div>
              <div className="error-icon">🚫</div>
            </div>

            {/* Error Message */}
            <h1 className="not-found-title">Page Not Found</h1>
            
            <p className="not-found-description">
              Oops! The page you're looking for doesn't exist or has been moved. 
              Let's get you back on track!
            </p>

            {/* Navigation Buttons */}
            <div className="not-found-actions">
              <Link to="/" className="btn-primary btn-large">
                <span className="btn-icon">🏠</span>
                Back to Homepage
              </Link>
              
              <Link to="/learning/blog" className="btn-secondary btn-large">
                <span className="btn-icon">📚</span>
                View Blog Articles
              </Link>
            </div>

            {/* Quick Links */}
            <div className="not-found-suggestions">
              <p className="suggestions-title">Explore Popular Tools:</p>
              <div className="suggestions-grid">
                <Link to="/budget-planner" className="suggestion-link">
                  <span className="suggestion-icon">🤖</span>
                  <span className="suggestion-text">AI Budget Planner</span>
                </Link>
                
                <Link to="/travel-budget" className="suggestion-link">
                  <span className="suggestion-icon">✈️</span>
                  <span className="suggestion-text">Travel Budget</span>
                </Link>
                
                <Link to="/calculators" className="suggestion-link">
                  <span className="suggestion-icon">🧮</span>
                  <span className="suggestion-text">All Calculators</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFound;
