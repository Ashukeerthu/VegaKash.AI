import React from 'react';

/**
 * Hero Component
 * Top section with title and call-to-action
 */
function Hero() {
  const scrollToForm = () => {
    document.getElementById('financial-form')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <header className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="highlight">VegaKash.AI</span>
        </h1>
        <h2 className="hero-subtitle">
          AI Budget Planner & Savings Assistant
        </h2>
        <p className="hero-description">
          Enter your financial details and get a personalized monthly budget and savings plan powered by AI. 
          <br />
          <strong>No login required.</strong> Your data is processed securely and not stored.
        </p>
        <button 
          className="cta-button"
          onClick={scrollToForm}
        >
          Start Planning Your Finances
        </button>
      </div>
    </header>
  );
}

export default Hero;
