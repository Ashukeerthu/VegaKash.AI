/**
 * Feedback Page Component
 * Dedicated page for detailed feedback submission
 */

import React, { useState } from 'react';
import { submitFeedback, FEEDBACK_TYPES, validateFeedback } from '../../services/feedbackService';
import './FeedbackPage.css';

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    rating: 0,
    feedbackType: 'general',
    message: '',
    userName: '',
    userEmail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const feedbackCategories = [
    { id: 'general', label: '💬 General Feedback', description: 'Share your thoughts about VegakTools' },
    { id: 'feature', label: '💡 Feature Request', description: 'Suggest new features or improvements' },
    { id: 'bug', label: '🐛 Bug Report', description: 'Report issues or problems you encountered' },
    { id: 'usability', label: '🎯 Usability', description: 'Help us improve user experience' },
    { id: 'content', label: '📝 Content', description: 'Feedback about our tools and results' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleStarClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const feedbackData = {
      feedback_type: FEEDBACK_TYPES.PAGE_FEEDBACK,
      rating: formData.rating,
      message: `[${formData.feedbackType.toUpperCase()}] ${formData.message}`,
      user_name: formData.userName || undefined,
      user_email: formData.userEmail || undefined,
      page_url: '/feedback',
      category: formData.feedbackType
    };

    const validation = validateFeedback(feedbackData);
    if (!validation.isValid) {
      setError(validation.errors.join('. '));
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await submitFeedback(feedbackData);
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || 'Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }

    setIsSubmitting(false);
  };

  const handleNewFeedback = () => {
    setFormData({
      rating: 0,
      feedbackType: 'general',
      message: '',
      userName: '',
      userEmail: ''
    });
    setSubmitted(false);
    setError('');
  };

  if (submitted) {
    return (
      <div className="feedback-page">
        <div className="feedback-container">
          <div className="feedback-success">
            <div className="success-icon">✓</div>
            <h2>Thank You!</h2>
            <p>Your feedback has been submitted successfully. We appreciate you taking the time to help us improve VegakTools.</p>
            <button className="new-feedback-btn" onClick={handleNewFeedback}>
              Send More Feedback
            </button>
            <a href="/" className="back-home-link">← Back to Home</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-page">
      <div className="feedback-container">
        <div className="feedback-header">
          <h1>Share Your Feedback</h1>
          <p>Help us improve VegakTools by sharing your thoughts, suggestions, or reporting issues.</p>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          {/* Rating Section */}
          <div className="form-section">
            <label className="section-label">How would you rate your experience?</label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= formData.rating ? 'active' : ''}`}
                  onClick={() => handleStarClick(star)}
                  aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                >
                  ★
                </button>
              ))}
              <span className="rating-text">
                {formData.rating === 0 && 'Select a rating'}
                {formData.rating === 1 && 'Poor'}
                {formData.rating === 2 && 'Fair'}
                {formData.rating === 3 && 'Good'}
                {formData.rating === 4 && 'Very Good'}
                {formData.rating === 5 && 'Excellent'}
              </span>
            </div>
          </div>

          {/* Category Section */}
          <div className="form-section">
            <label className="section-label">What type of feedback?</label>
            <div className="category-grid">
              {feedbackCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={`category-btn ${formData.feedbackType === category.id ? 'selected' : ''}`}
                  onClick={() => handleInputChange('feedbackType', category.id)}
                >
                  <span className="category-label">{category.label}</span>
                  <span className="category-desc">{category.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Message Section */}
          <div className="form-section">
            <label className="section-label" htmlFor="feedback-message">
              Your feedback <span className="required">*</span>
            </label>
            <textarea
              id="feedback-message"
              className="feedback-textarea"
              placeholder="Please share your thoughts, suggestions, or describe any issues you've encountered..."
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={6}
              maxLength={2000}
              required
            />
            <div className="char-count">
              {formData.message.length}/2000 characters
            </div>
          </div>

          {/* Name Section */}
          <div className="form-section">
            <label className="section-label" htmlFor="feedback-name">
              Your name <span className="optional">(optional)</span>
            </label>
            <input
              type="text"
              id="feedback-name"
              className="feedback-input"
              placeholder="Your name"
              value={formData.userName}
              onChange={(e) => handleInputChange('userName', e.target.value)}
              maxLength={100}
            />
            <p className="input-hint">
              Let us know who you are (optional).
            </p>
          </div>

          {/* Email Section */}
          <div className="form-section">
            <label className="section-label" htmlFor="feedback-email">
              Your email <span className="optional">(optional)</span>
            </label>
            <input
              type="email"
              id="feedback-email"
              className="feedback-input"
              placeholder="your@email.com"
              value={formData.userEmail}
              onChange={(e) => handleInputChange('userEmail', e.target.value)}
            />
            <p className="input-hint">
              Provide your email if you'd like us to follow up on your feedback.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting || !formData.message.trim()}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Submitting...
              </>
            ) : (
              'Submit Feedback'
            )}
          </button>

          <p className="privacy-note">
            🔒 Your feedback is private and will only be used to improve our services.
          </p>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;
