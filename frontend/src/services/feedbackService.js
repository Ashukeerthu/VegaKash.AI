/**
 * Feedback Service
 * Handles all API calls for the feedback system
 * 
 * @module services/feedbackService
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Feedback types
 */
export const FEEDBACK_TYPES = {
  BUTTON_FEEDBACK: 'button-feedback',
  MICRO_SURVEY: 'micro-survey',
  PAGE_FEEDBACK: 'page-feedback',
};

/**
 * Feedback categories for page feedback
 */
export const FEEDBACK_CATEGORIES = {
  BUG: 'bug',
  SUGGESTION: 'suggestion',
  FEATURE_REQUEST: 'feature-request',
  GENERAL: 'general',
};

/**
 * Submit feedback to the backend API
 * 
 * @param {Object} feedbackData - The feedback data to submit
 * @param {string} feedbackData.feedback_type - Type of feedback
 * @param {number} [feedbackData.rating] - Star rating (1-5)
 * @param {string} feedbackData.message - Feedback message
 * @param {string} [feedbackData.user_name] - Optional user name
 * @param {string} [feedbackData.user_email] - Optional user email
 * @param {string} [feedbackData.page_url] - Current page URL
 * @param {string} [feedbackData.category] - Feedback category
 * @param {boolean} [feedbackData.was_helpful] - For micro-surveys
 * @param {string} [feedbackData.ai_feature] - For micro-surveys, AI feature used
 * @returns {Promise<Object>} Response from the API
 */
export async function submitFeedback(feedbackData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        feedback_type: feedbackData.feedback_type || FEEDBACK_TYPES.BUTTON_FEEDBACK,
        rating: feedbackData.rating || null,
        message: feedbackData.message,
        user_name: feedbackData.user_name || null,
        user_email: feedbackData.user_email || null,
        page_url: feedbackData.page_url || window.location.href,
        category: feedbackData.category || FEEDBACK_CATEGORIES.GENERAL,
        was_helpful: feedbackData.was_helpful ?? null,
        ai_feature: feedbackData.ai_feature || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to submit feedback');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
}

/**
 * Validate feedback data before submission
 * 
 * @param {Object} feedbackData - The feedback data to validate
 * @returns {Object} Validation result with isValid and errors array
 */
export function validateFeedback(feedbackData) {
  const errors = [];

  // Check message
  if (!feedbackData.message || feedbackData.message.trim().length === 0) {
    errors.push('Feedback message is required');
  } else if (feedbackData.message.length > 5000) {
    errors.push('Feedback message must be less than 5000 characters');
  }

  // Check rating if provided
  if (feedbackData.rating !== null && feedbackData.rating !== undefined) {
    if (feedbackData.rating < 1 || feedbackData.rating > 5) {
      errors.push('Rating must be between 1 and 5');
    }
  }

  // Check email format if provided
  if (feedbackData.user_email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(feedbackData.user_email)) {
      errors.push('Please enter a valid email address');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if the feedback system is healthy
 * 
 * @returns {Promise<Object>} Health status
 */
export async function checkFeedbackHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/feedback/health`);
    return await response.json();
  } catch (error) {
    console.error('Error checking feedback health:', error);
    return { status: 'error', message: error.message };
  }
}

export default {
  submitFeedback,
  validateFeedback,
  checkFeedbackHealth,
  FEEDBACK_TYPES,
  FEEDBACK_CATEGORIES,
};
