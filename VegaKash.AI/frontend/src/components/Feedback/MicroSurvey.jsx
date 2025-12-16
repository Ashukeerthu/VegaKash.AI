/**
 * Micro Survey Component
 * "Was this helpful?" popup that appears after AI results
 */

import React, { useState, useEffect } from 'react';
import { submitFeedback, FEEDBACK_TYPES, validateFeedback } from '../../services/feedbackService';
import './MicroSurvey.css';

const MicroSurvey = ({ 
  isVisible = false, 
  onClose, 
  context = '', // What result/feature this is for
  autoHideDelay = 0, // Auto hide after X ms (0 = no auto hide)
  position = 'inline' // 'inline', 'floating', 'toast'
}) => {
  const [selectedRating, setSelectedRating] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [dismissed, setDismissed] = useState(false);

  // Auto hide if configured
  useEffect(() => {
    if (autoHideDelay > 0 && isVisible && !selectedRating) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHideDelay, selectedRating]);

  // Reset when becomes visible
  useEffect(() => {
    if (isVisible) {
      setSelectedRating(null);
      setShowThankYou(false);
      setShowFollowUp(false);
      setAdditionalFeedback('');
      setError('');
      setDismissed(false);
    }
  }, [isVisible]);

  const handleRatingSelect = async (isHelpful) => {
    setSelectedRating(isHelpful);
    
    if (!isHelpful) {
      // If not helpful, ask for more details
      setShowFollowUp(true);
    } else {
      // If helpful, submit immediately
      await submitQuickFeedback(isHelpful, '');
    }
  };

  const submitQuickFeedback = async (isHelpful, message = '') => {
    setIsSubmitting(true);
    setError('');

    const feedbackData = {
      feedback_type: FEEDBACK_TYPES.MICRO_SURVEY,
      rating: isHelpful ? 5 : 2, // Convert to 5-star scale
      message: message || (isHelpful ? 'User found this helpful' : 'User did not find this helpful'),
      page_url: window.location.pathname + window.location.search,
      ai_feature: context // Additional context like "travel-budget-result"
    };

    const validation = validateFeedback(feedbackData);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await submitFeedback(feedbackData);
      if (result.success) {
        setShowThankYou(true);
        setShowFollowUp(false);
        // Auto close after showing thank you
        setTimeout(() => {
          handleDismiss();
        }, 2000);
      } else {
        setError(result.error || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }

    setIsSubmitting(false);
  };

  const handleFollowUpSubmit = async () => {
    await submitQuickFeedback(false, additionalFeedback);
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible || dismissed) {
    return null;
  }

  const containerClass = `micro-survey ${position}`;

  return (
    <div className={containerClass}>
      {/* Close button */}
      <button 
        className="micro-survey-close"
        onClick={handleDismiss}
        aria-label="Dismiss"
      >
        ×
      </button>

      {/* Thank you message */}
      {showThankYou ? (
        <div className="micro-survey-thankyou">
          <span className="thankyou-icon">✓</span>
          <span>Thanks for your feedback!</span>
        </div>
      ) : showFollowUp ? (
        /* Follow-up question for negative feedback */
        <div className="micro-survey-followup">
          <p className="followup-question">How can we improve?</p>
          <textarea
            className="followup-input"
            placeholder="Tell us what went wrong..."
            value={additionalFeedback}
            onChange={(e) => setAdditionalFeedback(e.target.value)}
            rows={2}
            maxLength={500}
          />
          <div className="followup-actions">
            <button
              className="followup-skip"
              onClick={() => submitQuickFeedback(false, '')}
              disabled={isSubmitting}
            >
              Skip
            </button>
            <button
              className="followup-submit"
              onClick={handleFollowUpSubmit}
              disabled={isSubmitting || !additionalFeedback.trim()}
            >
              {isSubmitting ? 'Sending...' : 'Submit'}
            </button>
          </div>
          {error && <p className="micro-survey-error">{error}</p>}
        </div>
      ) : (
        /* Initial question */
        <div className="micro-survey-question">
          <p className="question-text">Was this helpful?</p>
          <div className="question-buttons">
            <button
              className="helpful-btn yes"
              onClick={() => handleRatingSelect(true)}
              disabled={isSubmitting}
              aria-label="Yes, this was helpful"
            >
              <span className="btn-icon">👍</span>
              <span className="btn-text">Yes</span>
            </button>
            <button
              className="helpful-btn no"
              onClick={() => handleRatingSelect(false)}
              disabled={isSubmitting}
              aria-label="No, this was not helpful"
            >
              <span className="btn-icon">👎</span>
              <span className="btn-text">No</span>
            </button>
          </div>
          {error && <p className="micro-survey-error">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default MicroSurvey;
