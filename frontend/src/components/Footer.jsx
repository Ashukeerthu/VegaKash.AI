import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer Component with Legal Links
 * Required for AdSense approval
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
            <div className="mt-4">
              <p className="text-sm text-gray-400">Made with ❤️ in India</p>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/calculators/emi" className="footer-link">EMI Calculator</Link></li>
              <li><Link to="/calculators/sip" className="footer-link">SIP Calculator</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="footer-link">Terms & Conditions</Link></li>
              <li><Link to="/disclaimer" className="footer-link">Disclaimer</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Important Notice</h4>
            <p>
              This tool provides general educational guidance only and is NOT certified financial advice. 
              Always consult with a certified financial advisor for personalized recommendations.
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} VegaKash.AI. All rights reserved.</p>
          <p className="text-sm text-gray-400">
            Budget Planner & Savings Assistant | Free Financial Tools
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

// TODO: Phase 2 - Add social media links
// TODO: Phase 2 - Add contact form
// TODO: Phase 2 - Add newsletter signup
