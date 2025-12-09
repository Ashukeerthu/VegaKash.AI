import React, { useState, useEffect } from 'react';
import './TravelLoadingScreen.css';

/**
 * Travel-themed Loading Screen
 * Shows beautiful loader with travel industry standard messaging
 * Displays realistic estimation: 15-45 seconds for AI processing
 */
function TravelLoadingScreen({ isLoading, title = "Planning Your Journey" }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setElapsedSeconds(0);
      setLoadingPhase(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsedSeconds(prev => {
        const newSeconds = prev + 1;
        // Update phase: 0-15s = phase 1, 15-30s = phase 2, 30+ = phase 3
        if (newSeconds <= 15) setLoadingPhase(1);
        else if (newSeconds <= 30) setLoadingPhase(2);
        else setLoadingPhase(3);
        return newSeconds;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  const loadingMessages = [
    {
      phase: 1,
      title: "✈️ Setting Up Your Journey",
      messages: [
        "Analyzing flight options...",
        "Checking accommodation availability...",
        "Computing travel costs...",
        "Processing your preferences..."
      ]
    },
    {
      phase: 2,
      title: "🗺️ Creating Your Itinerary",
      messages: [
        "Discovering local attractions...",
        "Planning daily activities...",
        "Calculating transit routes...",
        "Building your experience..."
      ]
    },
    {
      phase: 3,
      title: "💎 Perfecting Your Adventure",
      messages: [
        "Adding insider tips...",
        "Optimizing your schedule...",
        "Fine-tuning recommendations...",
        "Almost ready!"
      ]
    }
  ];

  const currentPhaseData = loadingMessages.find(msg => msg.phase === loadingPhase) || loadingMessages[0];
  const messageIndex = Math.floor((elapsedSeconds % 4));
  const currentMessage = currentPhaseData.messages[messageIndex];

  return (
    <div className="travel-loading-overlay">
      <div className="travel-loading-container">
        {/* Animated Travel Icon */}
        <div className="travel-loading-icon">
          <div className="plane-animation">
            <span>✈️</span>
          </div>
        </div>

        {/* Main Title */}
        <h2 className="loading-title">{title}</h2>

        {/* Phase Title */}
        <h3 className="loading-phase-title">{currentPhaseData.title}</h3>

        {/* Animated Progress Bar */}
        <div className="loading-progress">
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{
                width: `${Math.min((elapsedSeconds / 45) * 100, 95)}%`
              }}
            ></div>
          </div>
          <div className="progress-text">
            <span className="elapsed-time">{elapsedSeconds}s</span>
            <span className="estimated-time">~45s remaining</span>
          </div>
        </div>

        {/* Current Status Message */}
        <div className="loading-message">
          <div className="message-dots">
            <span>●</span>
            <span>●</span>
            <span>●</span>
          </div>
          <p>{currentMessage}</p>
          <div className="message-dots">
            <span>●</span>
            <span>●</span>
            <span>●</span>
          </div>
        </div>

        {/* Loading Phase Indicator */}
        <div className="loading-phases">
          <div className={`phase-indicator ${loadingPhase >= 1 ? 'active' : ''}`}>
            <span>1</span>
            <p>Flights</p>
          </div>
          <div className={`phase-indicator ${loadingPhase >= 2 ? 'active' : ''}`}>
            <span>2</span>
            <p>Itinerary</p>
          </div>
          <div className={`phase-indicator ${loadingPhase >= 3 ? 'active' : ''}`}>
            <span>3</span>
            <p>Optimization</p>
          </div>
        </div>

        {/* Helpful Text */}
        <p className="loading-helper-text">
          🚀 Our AI is crafting your personalized travel experience (15-45 seconds). Navigation stays available above if you need it.
        </p>
      </div>
    </div>
  );
}

export default TravelLoadingScreen;
