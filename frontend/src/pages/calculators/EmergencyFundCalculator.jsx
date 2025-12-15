import React from 'react';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import '../../styles/Calculator.css';
import '../../styles/Pages.css';
import ScrollToTop from '../../modules/core/ui/ScrollToTop';

/**
 * Emergency Fund Calculator - Coming Soon
 */
function EmergencyFundCalculator() {
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Calculators', path: '/calculators' },
    { label: 'Emergency Fund Calculator', path: null }
  ];
  
  return (
    <>
      <ScrollToTop threshold={300} />
      <SEO 
        title="Emergency Fund Calculator - Coming Soon | VegaKash.AI"
        description="Calculate how much emergency fund you need based on your monthly expenses and financial situation. Build financial security."
        keywords="emergency fund calculator, financial security, emergency savings, 3-6 months expenses"
        canonical="/calculators/emergency-fund"
        noindex={true}
      />
      
      <div className="page-container">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="page-header">
          <h1>🛡️ Emergency Fund Calculator</h1>
          <p>Calculate emergency fund requirements</p>
        </div>
        
        <div className="page-content">
          <div className="coming-soon-card">
            <div className="coming-soon-icon">🛡️</div>
            <h2>Coming Soon</h2>
            <p>Calculate your ideal emergency fund for financial security!</p>
            <p className="feature-list">
               3-6-12 Months Coverage Analysis<br/>
               Risk-Based Recommendations<br/>
               Liquid Fund Suggestions<br/>
               Auto-Investment Planning
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmergencyFundCalculator;
