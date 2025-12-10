/**
 * Floating Feedback Button Component
 * Fixed bottom-right button that opens the feedback modal
 */

import React, { useState } from 'react';
import FeedbackModal from './FeedbackModal';
import { FEEDBACK_TYPES } from '../../services/feedbackService';
import './FloatingFeedbackButton.css';

const FloatingFeedbackButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsExpanded(false);
  };

  return (
    <>
      {/* Floating Button */}
      <div 
        className={`floating-feedback-container ${isExpanded ? 'expanded' : ''}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <button
          className="floating-feedback-btn"
          onClick={handleOpenModal}
          aria-label="Send feedback"
          title="Send us your feedback"
        >
          <span className="feedback-icon">💬</span>
          <span className="feedback-text">Feedback</span>
        </button>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        feedbackType={FEEDBACK_TYPES.BUTTON_FEEDBACK}
      />
    </>
  );
};

export default FloatingFeedbackButton;
