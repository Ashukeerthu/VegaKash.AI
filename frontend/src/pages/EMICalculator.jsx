import React from 'react';
import SEO from '../components/SEO';
import '../styles/Pages.css';

function EMICalculator() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "EMI Calculator",
    "description": "Calculate your Equated Monthly Installment (EMI) for loans with our free online calculator",
    "applicationCategory": "FinanceApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <SEO 
        title="EMI Calculator - Calculate Loan EMI Instantly | VegaKash.AI"
        description="Free EMI calculator to calculate your loan EMI, total interest payable, and payment schedule. Calculate EMI for home loans, car loans, personal loans instantly."
        keywords="EMI calculator, loan EMI, home loan EMI, car loan EMI, personal loan calculator, monthly installment"
        canonical="/emi-calculator"
        structuredData={structuredData}
      />
      
      <div className="page-container">
        <div className="page-header">
          <h1>💰 EMI Calculator</h1>
          <p>Calculate your Equated Monthly Installment for any loan</p>
        </div>
        
        <div className="page-content">
          <div className="coming-soon-card">
            <div className="coming-soon-icon">🚧</div>
            <h2>Coming Soon</h2>
            <p>We're working on building the best EMI calculator for you!</p>
            <p className="feature-list">
              ✓ Calculate monthly EMI<br/>
              ✓ View amortization schedule<br/>
              ✓ Compare different loan options<br/>
              ✓ Export payment schedules
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default EMICalculator;
