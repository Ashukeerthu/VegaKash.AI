import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { EnhancedSEO } from '../../../components/EnhancedSEO';
import { AEOContentSection } from '../../../components/AEOContentSection';
import SEO from '../../../components/SEO';
import Breadcrumb from '../../../components/Breadcrumb';
import InfoTooltip from '../../../components/InfoTooltip';
import '../../../styles/Calculator.css';
import '../../../styles/SEOContent.css';
import '../../../styles/AEOContent.css';

/**
 * UK Savings Account Interest Calculator - PRODUCTION GRADE
 * Calculates compound interest for UK savings accounts with monthly contributions
 * Supports different compounding frequencies and regular deposits
 */
function SavingsInterestCalculatorUK() {
  const { country } = useParams();
  
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Calculators', path: '/calculators' },
    { label: 'UK Savings Interest Calculator', path: null }
  ];
  
  // Core inputs
  const [initialAmount, setInitialAmount] = useState(5000);
  const [monthlyContribution, setMonthlyContribution] = useState(200);
  const [interestRate, setInterestRate] = useState(4.5);
  const [timeYears, setTimeYears] = useState(5);
  const [compoundingFrequency, setCompoundingFrequency] = useState('monthly');
  const [accountType, setAccountType] = useState('isa'); // 'isa', 'regular', 'fixedterm'
  
  const [result, setResult] = useState(null);

  // Tooltips for user guidance
  const tooltips = {
    initialAmount: { text: 'The initial deposit amount. UK ISA limit is £20,000 per year. Premium Bonds maximum is £50,000.' },
    monthlyContribution: { text: 'Regular monthly deposits. Set to £0 if you\'re not making regular contributions. Remember ISA annual limits apply.' },
    interestRate: { text: 'Annual interest rate (AER - Annual Equivalent Rate). Top UK savings accounts offer 4-5% in 2025. Check comparison sites for current rates.' },
    timeYears: { text: 'Investment period in years. Consider inflation impact for longer periods - UK inflation target is 2%.' },
    compounding: { text: 'How often interest is calculated and added. Daily = highest returns. Annual = lowest. Most UK banks use daily compounding.' },
    accountType: { text: 'ISA: Tax-free up to £20,000/year. Regular: Taxable above personal allowance (£1,000 basic rate, £500 higher rate). Fixed Term: Higher rates but locked in.' }
  };

  // Compounding frequency options
  const compoundingOptions = {
    daily: { value: 365, label: 'Daily (Best Returns)' },
    monthly: { value: 12, label: 'Monthly' },
    quarterly: { value: 4, label: 'Quarterly' },
    annually: { value: 1, label: 'Annual' }
  };

  // Account type options with typical rates
  const accountTypes = {
    isa: { label: 'Cash ISA (Tax-Free)', rateBonus: 0, description: 'Tax-free savings up to £20,000 per year' },
    regular: { label: 'Regular Savings Account', rateBonus: 0, description: 'Taxable above personal allowance' },
    fixedterm: { label: 'Fixed Term Bond', rateBonus: 0.5, description: 'Higher rates but funds locked away' }
  };

  // Debounced calculation to improve performance
  const debouncedCalculate = useCallback(() => {
    const timeoutId = setTimeout(() => {
      calculateSavingsGrowth();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [initialAmount, monthlyContribution, interestRate, timeYears, compoundingFrequency, accountType]);

  useEffect(() => {
    const cleanup = debouncedCalculate();
    return cleanup;
  }, [debouncedCalculate]);

  const calculateSavingsGrowth = () => {
    const P = parseFloat(initialAmount) || 0;
    const PMT = parseFloat(monthlyContribution) || 0;
    const rateBonus = accountTypes[accountType].rateBonus || 0;
    const r = (parseFloat(interestRate) + rateBonus) / 100;
    const t = parseFloat(timeYears) || 0;
    const n = compoundingOptions[compoundingFrequency].value;
    
    if (P < 0 || PMT < 0 || r < 0 || t <= 0 || n <= 0) return;
    
    // Check ISA limits
    const annualContributions = PMT * 12;
    const totalContributions = P + (annualContributions * t);
    const exceedsISALimit = accountType === 'isa' && annualContributions > 20000;
    
    // Compound interest formula with regular contributions
    // A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]
    const compoundFactor = Math.pow(1 + r/n, n * t);
    const futureValuePrincipal = P * compoundFactor;
    
    let futureValueContributions = 0;
    if (PMT > 0 && r > 0) {
      futureValueContributions = PMT * ((compoundFactor - 1) / (r/n));
    } else if (PMT > 0) {
      futureValueContributions = PMT * n * t; // No interest case
    }
    
    const totalValue = futureValuePrincipal + futureValueContributions;
    const totalContributed = P + (PMT * 12 * t);
    const totalInterest = totalValue - totalContributed;
    
    // Tax calculations (simplified)
    let taxOnInterest = 0;
    if (accountType === 'regular') {
      const personalAllowance = 1000; // Basic rate taxpayer allowance
      const taxableInterest = Math.max(0, totalInterest - personalAllowance);
      taxOnInterest = taxableInterest * 0.2; // Basic rate tax
    }
    
    const afterTaxValue = totalValue - taxOnInterest;
    const netInterestEarned = totalInterest - taxOnInterest;
    
    // Calculate effective annual return
    const effectiveRate = t > 0 ? (Math.pow(totalValue / totalContributed, 1/t) - 1) * 100 : 0;
    
    // Monthly breakdown for year 1
    const monthlyBreakdown = [];
    let runningBalance = P;
    const monthlyRate = r / n * (n/12); // Monthly effective rate
    
    for (let month = 1; month <= Math.min(12, t * 12); month++) {
      const monthlyInterest = runningBalance * monthlyRate;
      runningBalance += monthlyInterest + PMT;
      monthlyBreakdown.push({
        month,
        balance: runningBalance,
        interest: monthlyInterest,
        contribution: PMT
      });
    }

    setResult({
      totalValue: totalValue.toFixed(2),
      totalContributed: totalContributed.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      netInterestEarned: netInterestEarned.toFixed(2),
      taxOnInterest: taxOnInterest.toFixed(2),
      afterTaxValue: afterTaxValue.toFixed(2),
      effectiveRate: effectiveRate.toFixed(2),
      monthlyBreakdown,
      exceedsISALimit,
      yearsToTarget: t,
      accountTypeInfo: accountTypes[accountType]
    });
  };

  const formatCurrency = (value) => {
    return `£${parseFloat(value).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;
  };

  const formatCurrencyDetailed = (value) => {
    return `£${parseFloat(value).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleReset = () => {
    setInitialAmount(5000);
    setMonthlyContribution(200);
    setInterestRate(4.5);
    setTimeYears(5);
    setCompoundingFrequency('monthly');
    setAccountType('isa');
  };

  // SEO configuration
  const seoConfig = {
    title: country 
      ? `UK Savings Interest Calculator for ${country.toUpperCase()} - Compound Interest & ISA Calculator`
      : 'UK Savings Interest Calculator - Compound Interest & ISA Returns | VegaKash.AI',
    description: country
      ? `Calculate UK savings account interest and ISA returns for ${country.toUpperCase()}. Free compound interest calculator with monthly contributions.`
      : 'Calculate UK savings account interest, ISA returns, and compound growth with monthly contributions. Free, accurate savings calculator for 2025.',
    keywords: country
      ? `UK savings calculator ${country.toUpperCase()}, ISA calculator, compound interest UK`
      : 'UK savings calculator, ISA calculator, compound interest calculator UK, savings account returns',
    tool: 'savings-interest-uk',
    country: country || undefined,
    supportedCountries: ['uk'],
    isGlobal: !country,
  };

  return (
    <>
      {/* SEO Tags - Global & Country-Specific */}
      <EnhancedSEO {...seoConfig} />
      <SEO 
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
      />
      
      <div className="calculator-container">
        <Breadcrumb items={breadcrumbItems} />
        <div className="calculator-header">
          <h1>UK Savings Interest Calculator</h1>
          <p>Calculate compound interest, ISA returns, and savings growth with regular contributions</p>
        </div>

        <div className="calculator-content">
          <div className="calculator-main-grid">
            <div className="calculator-inputs">
              
              {/* Initial Amount */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    Initial Deposit
                    <InfoTooltip {...tooltips.initialAmount} />
                  </label>
                  <input
                    type="text"
                    value={formatCurrency(initialAmount)}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val === '') {
                        setInitialAmount('');
                        return;
                      }
                      const num = parseInt(val);
                      if (!isNaN(num)) {
                        setInitialAmount(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      const num = parseInt(val);
                      if (val === '' || isNaN(num)) {
                        setInitialAmount(5000);
                      } else if (num < 0) {
                        setInitialAmount(0);
                      } else if (num > 1000000) {
                        setInitialAmount(1000000);
                      } else {
                        setInitialAmount(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="500"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>£0</span>
                  <span>£100K</span>
                </div>
              </div>

              {/* Monthly Contribution */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    Monthly Contribution
                    <InfoTooltip {...tooltips.monthlyContribution} />
                  </label>
                  <input
                    type="text"
                    value={formatCurrency(monthlyContribution)}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val === '') {
                        setMonthlyContribution('');
                        return;
                      }
                      const num = parseInt(val);
                      if (!isNaN(num)) {
                        setMonthlyContribution(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      const num = parseInt(val);
                      if (val === '' || isNaN(num)) {
                        setMonthlyContribution(200);
                      } else if (num < 0) {
                        setMonthlyContribution(0);
                      } else if (num > 5000) {
                        setMonthlyContribution(5000);
                      } else {
                        setMonthlyContribution(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>£0</span>
                  <span>£2K/mo</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    Interest Rate (% p.a.)
                    <InfoTooltip {...tooltips.interestRate} />
                  </label>
                  <input
                    type="text"
                    value={`${interestRate}%`}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[%\s]/g, '');
                      if (val === '') {
                        setInterestRate('');
                        return;
                      }
                      const num = parseFloat(val);
                      if (!isNaN(num)) {
                        setInterestRate(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[%\s]/g, '');
                      const num = parseFloat(val);
                      if (val === '' || isNaN(num)) {
                        setInterestRate(4.5);
                      } else if (num < 0) {
                        setInterestRate(0);
                      } else if (num > 15) {
                        setInterestRate(15);
                      } else {
                        setInterestRate(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>0%</span>
                  <span>10%</span>
                </div>
              </div>

              {/* Time Period */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    Time Period
                    <InfoTooltip {...tooltips.timeYears} />
                  </label>
                  <input
                    type="text"
                    value={`${timeYears} Years`}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val === '') {
                        setTimeYears('');
                        return;
                      }
                      const num = parseInt(val);
                      if (!isNaN(num)) {
                        setTimeYears(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      const num = parseInt(val);
                      if (val === '' || isNaN(num)) {
                        setTimeYears(5);
                      } else if (num < 1) {
                        setTimeYears(1);
                      } else if (num > 50) {
                        setTimeYears(50);
                      } else {
                        setTimeYears(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={timeYears}
                  onChange={(e) => setTimeYears(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>1 Yr</span>
                  <span>30 Yrs</span>
                </div>
              </div>

              {/* Compounding Frequency */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    Compounding Frequency
                    <InfoTooltip {...tooltips.compounding} />
                  </label>
                  <select
                    value={compoundingFrequency}
                    onChange={(e) => setCompoundingFrequency(e.target.value)}
                    className="input-display"
                    style={{ width: '100%' }}
                  >
                    {Object.entries(compoundingOptions).map(([key, option]) => (
                      <option key={key} value={key}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Account Type */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    Account Type
                    <InfoTooltip {...tooltips.accountType} />
                  </label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="input-display"
                    style={{ width: '100%' }}
                  >
                    {Object.entries(accountTypes).map(([key, type]) => (
                      <option key={key} value={key}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  {accountTypes[accountType].description}
                </div>
              </div>

              {/* Reset Button */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                <button onClick={handleReset} className="btn-reset">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C9.84871 2 11.5151 2.87161 12.6 4.2M12.6 4.2V1M12.6 4.2H9.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Reset to Default
                </button>
              </div>
            </div>

            {/* Results Section */}
            {result && (
              <div className="calculator-results">
                <h2>Your Savings Growth</h2>
                
                {/* ISA Limit Warning */}
                {result.exceedsISALimit && (
                  <div className="warning-box" style={{
                    padding: '1rem',
                    background: 'rgba(245, 101, 101, 0.1)',
                    border: '1px solid rgba(245, 101, 101, 0.3)',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}>
                    <strong>⚠️ ISA Limit Exceeded:</strong> Your annual contributions (£{formatCurrency(monthlyContribution * 12)}) exceed the £20,000 ISA limit.
                  </div>
                )}
                
                <div className="result-cards">
                  <div className="result-card highlight">
                    <div className="result-label">Final Value</div>
                    <div className="result-value">{formatCurrency(result.afterTaxValue)}</div>
                  </div>
                  
                  <div className="result-card">
                    <div className="result-label">Total Contributed</div>
                    <div className="result-value">{formatCurrency(result.totalContributed)}</div>
                  </div>
                  
                  <div className="result-card success">
                    <div className="result-label">Interest Earned</div>
                    <div className="result-value">{formatCurrency(result.netInterestEarned)}</div>
                  </div>
                  
                  <div className="result-card">
                    <div className="result-label">Effective Annual Return</div>
                    <div className="result-value">{result.effectiveRate}%</div>
                  </div>
                </div>

                {/* Tax Information */}
                {accountType === 'regular' && parseFloat(result.taxOnInterest) > 0 && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'rgba(79, 70, 229, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(79, 70, 229, 0.1)'
                  }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#4f46e5' }}>Tax Impact</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Interest Before Tax:</span>
                      <strong>{formatCurrency(result.totalInterest)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Tax on Interest (20%):</span>
                      <strong style={{ color: '#dc2626' }}>-{formatCurrency(result.taxOnInterest)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                      <span>Interest After Tax:</span>
                      <strong>{formatCurrency(result.netInterestEarned)}</strong>
                    </div>
                  </div>
                )}

                {/* Growth Breakdown Chart */}
                <div className="breakdown-chart">
                  <h3>Savings Breakdown</h3>
                  <div className="chart-bar">
                    <div 
                      className="chart-segment principal"
                      style={{ 
                        width: `${(parseFloat(result.totalContributed) / parseFloat(result.afterTaxValue) * 100).toFixed(1)}%` 
                      }}
                    >
                      <span className="chart-label">Contributions</span>
                    </div>
                    <div 
                      className="chart-segment interest"
                      style={{ 
                        width: `${(parseFloat(result.netInterestEarned) / parseFloat(result.afterTaxValue) * 100).toFixed(1)}%` 
                      }}
                    >
                      <span className="chart-label">Interest</span>
                    </div>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="legend-color principal"></div>
                      <span>Your Contributions: {formatCurrency(result.totalContributed)}</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color interest"></div>
                      <span>Interest Earned: {formatCurrency(result.netInterestEarned)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="seo-content-section">
          <div className="content-block">
            <h2>How to Calculate UK Savings Interest</h2>
            <p>UK savings accounts typically use compound interest calculated daily. The formula is:</p>
            <div className="formula-box">
              <strong>A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]</strong>
            </div>
            <p>Where:</p>
            <ul>
              <li><strong>A</strong> = Final amount</li>
              <li><strong>P</strong> = Principal (initial deposit)</li>
              <li><strong>r</strong> = Annual interest rate (decimal)</li>
              <li><strong>n</strong> = Compounding frequency per year</li>
              <li><strong>t</strong> = Number of years</li>
              <li><strong>PMT</strong> = Regular monthly contribution</li>
            </ul>
          </div>
          
          <div className="content-block">
            <h2>UK Savings Account FAQ</h2>
            <ul>
              <li><strong>What's the difference between AER and gross rate?</strong> AER (Annual Equivalent Rate) includes compounding effects and gives the true annual return. Always compare AER rates.</li>
              <li><strong>How much can I save tax-free in an ISA?</strong> £20,000 per year for 2025. This can be split between Cash ISAs and Stocks & Shares ISAs.</li>
              <li><strong>When do I pay tax on savings interest?</strong> Basic rate taxpayers have a £1,000 personal savings allowance. Higher rate taxpayers get £500. Above this, you pay 20% or 40% tax.</li>
              <li><strong>What are the best UK savings rates in 2025?</strong> Top easy access accounts offer 4-5% AER. Fixed rate bonds can offer slightly higher but lock your money away.</li>
            </ul>
          </div>
          
          <div className="content-block">
            <h2>Types of UK Savings Accounts</h2>
            <ul>
              <li><strong>Cash ISA:</strong> Tax-free savings up to £20,000 annually. Interest is completely tax-free.</li>
              <li><strong>Easy Access Accounts:</strong> Withdraw money anytime. Rates typically 3-5% but can vary.</li>
              <li><strong>Fixed Rate Bonds:</strong> Lock money away for 1-5 years for guaranteed rates, often 0.5-1% higher.</li>
              <li><strong>Regular Savings:</strong> High rates (up to 7%) but limited monthly deposits, usually £250-500.</li>
            </ul>
          </div>
        </div>

        {/* AEO Content Section */}
        <AEOContentSection tool="savingsinterest" country={country} />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FinancialProduct",
          "name": "UK Savings Interest Calculator",
          "description": "Calculate UK savings account interest, ISA returns, and compound growth with monthly contributions.",
          "provider": {"@type": "Organization", "name": "VegaKash.AI"},
          "applicationCategory": "Calculator",
          "offers": {"@type": "Offer", "price": "0", "priceCurrency": "GBP"}
        })}</script>
      </div>
    </>
  );
}

export default SavingsInterestCalculatorUK;
