/**
 * Feedback Modal Component
 * Modal dialog for collecting user feedback with star rating
 */

import React, { useState, useEffect } from 'react';
import { submitFeedback, FEEDBACK_TYPES, FEEDBACK_CATEGORIES, validateFeedback } from '../../services/feedbackService';
import './FeedbackModal.css';

/**
 * Star Rating Component
 */
const StarRating = ({ rating, onRatingChange, disabled = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
          onClick={() => !disabled && onRatingChange(star)}
          onMouseEnter={() => !disabled && setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          disabled={disabled}
          aria-label={`Rate ${star} stars`}
        >
          <span className="star-icon">
            {star <= (hoverRating || rating) ? '★' : '☆'}
          </span>
        </button>
      ))}
      {rating > 0 && (
        <span className="rating-text">{rating}/5</span>
      )}
    </div>
  );
};

/**
 * Feedback Modal Component
 */
const FeedbackModal = ({
  isOpen,
  onClose,
  feedbackType = FEEDBACK_TYPES.BUTTON_FEEDBACK,
  prefilledMessage = '',
  aiFeature = null,
  wasHelpful = null,
  showCategorySelect = false,
}) => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState(prefilledMessage);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState(FEEDBACK_CATEGORIES.GENERAL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setMessage(prefilledMessage);
      setUserName('');
      setEmail('');
      setCategory(FEEDBACK_CATEGORIES.GENERAL);
      setSubmitStatus(null);
      setErrorMessage('');
    }
  }, [isOpen, prefilledMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setErrorMessage('Please enter your feedback message.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await submitFeedback({
        feedback_type: feedbackType,
        rating: rating || null,
        message: message.trim(),
        user_name: userName.trim() || null,
        user_email: email.trim() || null,
        page_url: window.location.href,
        category: showCategorySelect ? category : FEEDBACK_CATEGORIES.GENERAL,
        was_helpful: wasHelpful,
        ai_feature: aiFeature,
      });

      setSubmitStatus('success');
      
      // Close modal after showing success message
      setTimeout(() => {
        onClose();
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="feedback-modal-header">
          <h2>
            <span className="header-icon">💬</span>
            Share Your Feedback
          </h2>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close feedback modal"
          >
            ✕
          </button>
        </div>

        {/* Success State */}
        {submitStatus === 'success' ? (
          <div className="feedback-success">
            <div className="success-icon">✓</div>
            <h3>Thank you for your feedback!</h3>
            <p>We appreciate you taking the time to help us improve.</p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="feedback-form">
            {/* Star Rating */}
            <div className="form-group">
              <label>How would you rate your experience?</label>
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                disabled={isSubmitting}
              />
            </div>

            {/* Category Select (for page feedback) */}
            {showCategorySelect && (
              <div className="form-group">
                <label htmlFor="feedback-category">Feedback Type</label>
                <select
                  id="feedback-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isSubmitting}
                  className="form-select"
                >
                  <option value={FEEDBACK_CATEGORIES.GENERAL}>General Feedback</option>
                  <option value={FEEDBACK_CATEGORIES.BUG}>Report a Bug 🐛</option>
                  <option value={FEEDBACK_CATEGORIES.SUGGESTION}>Suggestion 💡</option>
                  <option value={FEEDBACK_CATEGORIES.FEATURE_REQUEST}>Feature Request ✨</option>
                </select>
              </div>
            )}

            {/* Message */}
            <div className="form-group">
              <label htmlFor="feedback-message">
                Please share your feedback <span className="required">*</span>
              </label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's on your mind? We'd love to hear your thoughts..."
                rows={4}
                disabled={isSubmitting}
                className="form-textarea"
                required
              />
            </div>

            {/* Name (Optional) */}
            <div className="form-group">
              <label htmlFor="feedback-name">
                Your Name (optional)
              </label>
              <input
                type="text"
                id="feedback-name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                disabled={isSubmitting}
                className="form-input"
                maxLength={100}
              />
            </div>

            {/* Email (Optional) */}
            <div className="form-group">
              <label htmlFor="feedback-email">
                Email (optional)
                <span className="optional-hint">for follow-up only</span>
              </label>
              <input
                type="email"
                id="feedback-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={isSubmitting}
                className="form-input"
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {errorMessage}
              </div>
            )}

            {/* Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <span>📤</span>
                    Submit Feedback
                  </>
                )}
              </button>
            </div>

            {/* Privacy Note */}
            <p className="privacy-note">
              🔒 Your feedback is private and will only be seen by our team.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
