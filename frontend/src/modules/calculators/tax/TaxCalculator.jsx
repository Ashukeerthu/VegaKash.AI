import React from 'react';
import SEO from '../../../components/SEO';
import '../../../styles/Calculator.css';
import '../../../styles/Pages.css';
// MIGRATED: Modular structure from modules/calculators/tax/

/**
 * Income Tax Calculator - Coming Soon
 */
function IncomeTaxCalculator() {
  return (
    <>
      <SEO 
        title="Income Tax Calculator - Coming Soon | VegaKash.AI"
        description="Compare old vs new tax regime and calculate income tax for FY 2024-25. Smart tax planning tool coming soon."
        keywords="income tax calculator, tax regime comparison, tax planning, FY 2024-25, old vs new regime"
        canonical="/income-tax-calculator"
        structuredData={{
          "@graph": [
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vegaktools.com/" },
                { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://vegaktools.com/calculators" },
                { "@type": "ListItem", "position": 3, "name": "Income Tax Calculator", "item": "https://vegaktools.com/income-tax-calculator" }
              ]
            }
          ]
        }}
      />
      
      <div className="page-container">
        <div className="page-header">
          <h1>💸 Income Tax Calculator</h1>
          <p>Compare old vs new tax regime (FY 2024-25)</p>
        </div>
        
        <div className="page-content">
          <div className="coming-soon-card">
            <div className="coming-soon-icon">📊</div>
            <h2>Coming Soon</h2>
            <p>Advanced income tax calculator with regime comparison!</p>
            <p className="feature-list">
               Old vs New Regime Comparison<br/>
               Section 80C Deductions<br/>
               HRA & Other Exemptions<br/>
               Tax-Saving Recommendations
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default IncomeTaxCalculator;
