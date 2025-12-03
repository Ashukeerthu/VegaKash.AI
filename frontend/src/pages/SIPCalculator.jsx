import React from 'react';
import SEO from '../components/SEO';
import '../styles/Pages.css';

function SIPCalculator() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SIP Calculator",
    "description": "Calculate returns on your Systematic Investment Plan (SIP) investments",
    "applicationCategory": "FinanceApplication"
  };

  return (
    <>
      <SEO 
        title="SIP Calculator - Mutual Fund SIP Return Calculator | VegaKash.AI"
        description="Free SIP calculator to calculate returns on your systematic investment plan. Plan your mutual fund investments and estimate future value."
        keywords="SIP calculator, mutual fund calculator, systematic investment plan, SIP returns, investment calculator"
        canonical="/sip-calculator"
        structuredData={structuredData}
      />
      
      <div className="page-container">
        <div className="page-header">
          <h1>📈 SIP Calculator</h1>
          <p>Calculate returns on your Systematic Investment Plan</p>
        </div>
        
        <div className="page-content">
          <div className="coming-soon-card">
            <div className="coming-soon-icon">🚧</div>
            <h2>Coming Soon</h2>
            <p>Advanced SIP calculator with detailed projections!</p>
            <p className="feature-list">
              ✓ Calculate SIP returns<br/>
              ✓ View investment growth chart<br/>
              ✓ Compare different SIP amounts<br/>
              ✓ Goal-based planning
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SIPCalculator;
