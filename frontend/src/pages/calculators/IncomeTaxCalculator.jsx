import React from 'react';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import '../../styles/Calculator.css';
import ScrollToTop from '../../modules/core/ui/ScrollToTop';

/**
 * Income Tax Calculator - Coming Soon
 */
function IncomeTaxCalculator() {
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Calculators', path: '/calculators' },
    { label: 'Income Tax Calculator', path: null }
  ];
  
  return (
    <>
      <ScrollToTop threshold={300} />
      <SEO 
        title="Income Tax Calculator - Coming Soon | VegaKash.AI"
        description="Compare old vs new tax regime and calculate income tax for FY 2024-25. Smart tax planning tool coming soon."
        keywords="income tax calculator, tax regime comparison, tax planning, FY 2024-25, old vs new regime"
        canonical="/income-tax-calculator"
      />
      
      <div className="page-container">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="page-header">
          <h1> Income Tax Calculator</h1>
          <p>Compare old vs new tax regime (FY 2024-25)</p>
        </div>
        
        <div className="page-content">
          <div className="coming-soon-card">
            <div className="coming-soon-icon"></div>
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
