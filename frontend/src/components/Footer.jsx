import React from 'react';

/**
 * Footer Component
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>VegaKash.AI</h3>
            <p>AI-powered budget planning and savings assistance for smart financial decisions.</p>
          </div>
          
          <div className="footer-section">
            <h4>About</h4>
            <p>
              VegaKash.AI helps you plan your finances with AI-powered recommendations. 
              No login required, your data is processed securely and not stored.
            </p>
          </div>
          
          <div className="footer-section">
            <h4>Important Notice</h4>
            <p>
              This tool provides general educational guidance only and is not certified financial advice. 
              Always consult with a certified financial advisor for personalized recommendations.
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} VegaKash.AI. All rights reserved.</p>
          <p>Phase 1 - Budget Planner & Savings Assistant</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

// TODO: Phase 2 - Add links to Privacy Policy and Terms of Service
// TODO: Phase 2 - Add social media links
// TODO: Phase 2 - Add contact information
