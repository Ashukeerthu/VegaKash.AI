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
import ScrollToTop from '../../../modules/core/ui/ScrollToTop';

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
  const [compoundingFrequency, setCompoundingFrequency] = useState('daily');
  const [accountType, setAccountType] = useState('isa'); // 'isa', 'regular', 'fixedterm'
  const [taxBand, setTaxBand] = useState('basic'); // 'basic', 'higher', 'additional'
  const [inflationAdjusted, setInflationAdjusted] = useState(false);
  const [inflationRate, setInflationRate] = useState(2.0);
  const [showComparison, setShowComparison] = useState(false);
  
  const [result, setResult] = useState(null);

  // Tooltips for user guidance
  const tooltips = {
    initialAmount: { text: 'The initial deposit amount. UK ISA limit is £20,000 per tax year. Premium Bonds maximum is £50,000.' },
    monthlyContribution: { text: 'Regular monthly deposits. ISA annual limits apply (£20,000 including initial deposit per tax year).' },
    interestRate: { text: 'Annual interest rate (AER - Annual Equivalent Rate). Top UK savings accounts offer 4-5% in 2025. Fixed-term rates may be higher.' },
    timeYears: { text: 'Investment period in years. Consider inflation impact for longer periods - UK inflation target is 2%.' },
    compounding: { text: 'How often interest is calculated. Daily compounding gives highest returns and is most common in UK banks.' },
    accountType: { text: 'ISA: Tax-free up to £20,000/year. Regular: Taxable above personal allowance. Fixed Term: Enter your actual rate.' },
    taxBand: { text: 'Basic (20%): £1,000 savings allowance. Higher (40%): £500 allowance. Additional (45%): No allowance.' },
    inflation: { text: 'Shows purchasing power after inflation. UK inflation target is 2% annually.' }
  };

  // Tax band configuration
  const taxBands = {
    basic: { label: 'Basic Rate (20%)', rate: 0.2, allowance: 1000 },
    higher: { label: 'Higher Rate (40%)', rate: 0.4, allowance: 500 },
    additional: { label: 'Additional Rate (45%)', rate: 0.45, allowance: 0 }
  };

  // Compounding frequency options
  const compoundingOptions = {
    daily: { value: 365, label: 'Daily (Best Returns)' },
    monthly: { value: 12, label: 'Monthly' },
    quarterly: { value: 4, label: 'Quarterly' },
    annually: { value: 1, label: 'Annual' }
  };

  // Account type options - removed artificial rate bonus
  const accountTypes = {
    isa: { label: 'Cash ISA (Tax-Free)', description: 'Tax-free savings up to £20,000 per tax year' },
    regular: { label: 'Regular Savings Account', description: 'Taxable above personal allowance' },
    fixedterm: { label: 'Fixed Term Bond', description: 'Enter your provider\'s actual rate above' }
  };

  // Debounced calculation to improve performance
  const debouncedCalculate = useCallback(() => {
    const timeoutId = setTimeout(() => {
      calculateSavingsGrowth();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [initialAmount, monthlyContribution, interestRate, timeYears, compoundingFrequency, accountType, taxBand, inflationAdjusted, inflationRate]);

  useEffect(() => {
    const cleanup = debouncedCalculate();
    return cleanup;
  }, [debouncedCalculate]);

  const calculateSavingsGrowth = () => {
    const P = parseFloat(initialAmount) || 0;
    const PMT = parseFloat(monthlyContribution) || 0;
    const r = parseFloat(interestRate) / 100;
    const t = parseFloat(timeYears) || 0;
    const n = compoundingOptions[compoundingFrequency].value;
    const inflRate = parseFloat(inflationRate) / 100;
    
    if (P < 0 || PMT < 0 || r < 0 || t <= 0 || n <= 0) return;
    
    // ✅ FIX 1: Correct ISA limit check (includes initial amount)
    const yearOneISAContribution = P + (PMT * 12);
    const exceedsISALimit = accountType === 'isa' && yearOneISAContribution > 20000;
    
    // Calculate future value of initial amount
    const compoundFactor = Math.pow(1 + r/n, n * t);
    const futureValuePrincipal = P * compoundFactor;
    
    // ✅ FIX 2: Correct monthly contribution compounding (UK-realistic)
    const monthlyRate = r / 12; // Use monthly compounding for contributions
    let futureValueContributions = 0;
    
    if (PMT > 0) {
      for (let i = 1; i <= t * 12; i++) {
        // Each monthly payment compounds for remaining months
        futureValueContributions += PMT * Math.pow(1 + monthlyRate, (t * 12 - i));
      }
    }
    
    const totalValue = futureValuePrincipal + futureValueContributions;
    const totalContributed = P + (PMT * 12 * t);
    const totalInterest = totalValue - totalContributed;
    
    // ✅ FIX 3: Proper tax calculation with tax bands
    let taxOnInterest = 0;
    if (accountType === 'regular') {
      const taxInfo = taxBands[taxBand];
      const taxableInterest = Math.max(0, totalInterest - taxInfo.allowance);
      taxOnInterest = taxableInterest * taxInfo.rate;
    }
    
    const afterTaxValue = totalValue - taxOnInterest;
    const netInterestEarned = totalInterest - taxOnInterest;
    
    // ✅ FIX 4: Remove misleading "Effective Annual Return" - show input AER instead
    const inputAER = r * 100; // Just show the input rate as AER
    
    // ✅ FIX 5: Correct monthly breakdown with proper daily-to-monthly conversion
    const monthlyBreakdown = [];
    let runningBalance = P;
    const correctMonthlyRate = Math.pow(1 + r/n, n/12) - 1; // Proper conversion from daily to monthly
    
    for (let month = 1; month <= Math.min(12, t * 12); month++) {
      const monthlyInterest = runningBalance * correctMonthlyRate;
      runningBalance += monthlyInterest + PMT;
      monthlyBreakdown.push({
        month,
        balance: runningBalance,
        interest: monthlyInterest,
        contribution: PMT
      });
    }

    // Inflation adjustment
    let realValue = afterTaxValue;
    let realNetInterest = netInterestEarned;
    if (inflationAdjusted && inflRate > 0) {
      const inflationFactor = Math.pow(1 + inflRate, t);
      realValue = afterTaxValue / inflationFactor;
      realNetInterest = netInterestEarned / inflationFactor;
    }

    // ISA vs Regular comparison (if enabled)
    let comparison = null;
    if (showComparison && accountType !== 'isa') {
      // Calculate ISA equivalent
      const isaValue = totalValue; // No tax on ISA
      const taxSaved = taxOnInterest;
      comparison = {
        isaValue: isaValue.toFixed(2),
        taxSaved: taxSaved.toFixed(2),
        difference: (isaValue - afterTaxValue).toFixed(2)
      };
    }

    setResult({
      totalValue: totalValue.toFixed(2),
      totalContributed: totalContributed.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      netInterestEarned: netInterestEarned.toFixed(2),
      taxOnInterest: taxOnInterest.toFixed(2),
      afterTaxValue: afterTaxValue.toFixed(2),
      inputAER: inputAER.toFixed(2),
      realValue: realValue.toFixed(2),
      realNetInterest: realNetInterest.toFixed(2),
      monthlyBreakdown,
      exceedsISALimit,
      yearOneISAContribution,
      yearsToTarget: t,
      accountTypeInfo: accountTypes[accountType],
      taxBandInfo: taxBands[taxBand],
      comparison,
      inflationUsed: inflationAdjusted
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
    setCompoundingFrequency('daily');
    setAccountType('isa');
    setTaxBand('basic');
    setInflationAdjusted(false);
    setInflationRate(2.0);
    setShowComparison(false);
  };

  // CSV Export functionality
  const exportToCSV = () => {
    if (!result) return;
    
    const csvData = [
      ['UK Savings Interest Calculator Results'],
      ['Generated', new Date().toLocaleDateString('en-GB')],
      [''],
      ['Input Parameters'],
      ['Initial Deposit', `£${formatCurrency(initialAmount)}`],
      ['Monthly Contribution', `£${formatCurrency(monthlyContribution)}`],
      ['Interest Rate (AER)', `${interestRate}%`],
      ['Time Period', `${timeYears} years`],
      ['Account Type', accountTypes[accountType].label],
      ['Tax Band', accountType === 'regular' ? taxBands[taxBand].label : 'Tax-Free'],
      [''],
      ['Results Summary'],
      ['Total Contributed', `£${result.totalContributed}`],
      ['Interest Earned (Gross)', `£${result.totalInterest}`],
      ['Tax on Interest', `£${result.taxOnInterest}`],
      ['Final Value (After Tax)', `£${result.afterTaxValue}`],
      ...(result.inflationUsed ? [['Real Value (Inflation-Adjusted)', `£${result.realValue}`]] : []),
      [''],
      ['Monthly Breakdown (Year 1)'],
      ['Month', 'Balance', 'Interest', 'Contribution'],
      ...result.monthlyBreakdown.map(month => [
        month.month,
        `£${formatCurrencyDetailed(month.balance)}`,
        `£${formatCurrencyDetailed(month.interest)}`,
        `£${formatCurrency(month.contribution)}`
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UK-Savings-Calculator-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
      <ScrollToTop threshold={300} />
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
              <div className="inputs-grid">
              {/* Account Details Section */}
              <details open style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem 1rem', background: 'white' }}>
                <summary style={{ fontWeight: 700, fontSize: '1rem', color: '#334155', cursor: 'pointer', marginBottom: '1rem' }}>Account Details</summary>
              
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

                </details>

                {/* Interest Settings Section */}
                <details style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem 1rem', background: 'white' }}>
                  <summary style={{ fontWeight: 700, fontSize: '1rem', color: '#334155', cursor: 'pointer', marginBottom: '1rem' }}>Interest Settings</summary>

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

              {/* Tax Band (only for regular accounts) */}
              {accountType === 'regular' && (
                <div className="slider-group">
                  <div className="slider-header">
                    <label>
                      Tax Band
                      <InfoTooltip {...tooltips.taxBand} />
                    </label>
                    <select
                      value={taxBand}
                      onChange={(e) => setTaxBand(e.target.value)}
                      className="input-display"
                      style={{ width: '100%' }}
                    >
                      {Object.entries(taxBands).map(([key, band]) => (
                        <option key={key} value={key}>{band.label}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    Personal savings allowance: £{taxBands[taxBand].allowance.toLocaleString()}
                  </div>
                </div>
              )}

              {/* Advanced Options Toggle */}
              <div className="slider-group">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      id="inflationToggle"
                      checked={inflationAdjusted}
                      onChange={(e) => setInflationAdjusted(e.target.checked)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <label htmlFor="inflationToggle" style={{ fontSize: '0.9rem', color: '#374151' }}>
                      Show inflation-adjusted returns
                      <InfoTooltip {...tooltips.inflation} />
                    </label>
                  </div>
                  
                  {inflationAdjusted && (
                    <div className="slider-header">
                      <label style={{ fontSize: '0.85rem' }}>Annual Inflation Rate</label>
                      <input
                        type="text"
                        value={`${inflationRate}%`}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[%\s]/g, '');
                          const num = parseFloat(val);
                          if (!isNaN(num) && num >= 0 && num <= 10) {
                            setInflationRate(num);
                          }
                        }}
                        className="input-display"
                        style={{ fontSize: '0.85rem', padding: '0.5rem' }}
                      />
                    </div>
                  )}

                  {accountType !== 'isa' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        id="comparisonToggle"
                        checked={showComparison}
                        onChange={(e) => setShowComparison(e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <label htmlFor="comparisonToggle" style={{ fontSize: '0.9rem', color: '#374151' }}>
                        Compare with ISA alternative
                      </label>
                    </div>
                  )}
                </div>
              </div>

                </details>
              </div>

              {/* Reset Button */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                <button onClick={handleReset} className="btn-reset">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C9.84871 2 11.5151 2.87161 12.6 4.2M12.6 4.2V1M12.6 4.2H9.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Reset to Default
                </button>
                
                {result && (
                  <button onClick={exportToCSV} className="btn-export" style={{
                    padding: '0.75rem 1.5rem',
                    background: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'background-color 0.2s'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 1V11M8 11L4 7M8 11L12 7M1 12V14C1 14.5523 1.44772 15 2 15H14C14.5523 15 15 14.5523 15 14V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Export CSV
                  </button>
                )}
              </div>
            </div>

            {/* Results Section */}
            {result && (
              <div className="calculator-results">
                <h2>Your Savings Growth</h2>
                
                {/* FCA Compliance Disclaimer */}
                <div style={{
                  padding: '1rem',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.85rem'
                }}>
                  <strong>⚖️ Important:</strong> This calculator provides illustrative estimates only. 
                  Actual returns depend on provider terms, tax status, compounding method, and market conditions. 
                  This is not financial advice.
                </div>

                {/* ISA Limit Warning */}
                {result.exceedsISALimit && (
                  <div className="warning-box" style={{
                    padding: '1rem',
                    background: 'rgba(245, 101, 101, 0.1)',
                    border: '1px solid rgba(245, 101, 101, 0.3)',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}>
                    <strong>⚠️ ISA Limit Exceeded:</strong> Your year 1 total (£{formatCurrency(result.yearOneISAContribution)}) 
                    exceeds the £20,000 annual ISA allowance. ISA limits apply per tax year.
                  </div>
                )}
                
                <div className="result-cards">
                  <div className="result-card highlight">
                    <div className="result-label">
                      {result.inflationUsed ? 'Final Value (Real)' : 'Final Value'}
                    </div>
                    <div className="result-value">
                      {formatCurrency(result.inflationUsed ? result.realValue : result.afterTaxValue)}
                    </div>
                    {result.inflationUsed && (
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        Nominal: {formatCurrency(result.afterTaxValue)}
                      </div>
                    )}
                  </div>
                  
                  <div className="result-card">
                    <div className="result-label">Total Contributed</div>
                    <div className="result-value">{formatCurrency(result.totalContributed)}</div>
                  </div>
                  
                  <div className="result-card success">
                    <div className="result-label">
                      {result.inflationUsed ? 'Interest Earned (Real)' : 'Interest Earned'}
                    </div>
                    <div className="result-value">
                      {formatCurrency(result.inflationUsed ? result.realNetInterest : result.netInterestEarned)}
                    </div>
                    {result.inflationUsed && (
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        Nominal: {formatCurrency(result.netInterestEarned)}
                      </div>
                    )}
                  </div>
                  
                  <div className="result-card">
                    <div className="result-label">Input Rate (AER)</div>
                    <div className="result-value">{result.inputAER}%</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      Annual Equivalent Rate
                    </div>
                  </div>
                </div>

                {/* ISA vs Regular Comparison */}
                {result.comparison && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'rgba(16, 185, 129, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(16, 185, 129, 0.1)'
                  }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#059669' }}>
                      💡 ISA Alternative Comparison
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Current Account Value:</div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{formatCurrency(result.afterTaxValue)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>If Using ISA:</div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#059669' }}>
                          {formatCurrency(result.comparison.isaValue)}
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px' }}>
                      <strong>Tax Savings with ISA: {formatCurrency(result.comparison.taxSaved)}</strong>
                    </div>
                  </div>
                )}

                {/* Tax Information */}
                {accountType === 'regular' && parseFloat(result.taxOnInterest) > 0 && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'rgba(79, 70, 229, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(79, 70, 229, 0.1)'
                  }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#4f46e5' }}>
                      Tax Impact ({result.taxBandInfo.label})
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Interest Before Tax:</span>
                      <strong>{formatCurrency(result.totalInterest)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Personal Allowance:</span>
                      <strong>£{result.taxBandInfo.allowance.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Tax on Interest ({(result.taxBandInfo.rate * 100).toFixed(0)}%):</span>
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

                {/* Provider Comparison Links */}
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: 'rgba(99, 102, 241, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(99, 102, 241, 0.1)'
                }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#6366f1' }}>
                    🔍 Find Better Rates
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                    <a href="https://www.moneysavingexpert.com/savings/savings-accounts-best-interest/" 
                       target="_blank" rel="noopener noreferrer"
                       style={{ color: '#6366f1', textDecoration: 'none', fontSize: '0.85rem' }}>
                      → MoneySavingExpert Best Buys
                    </a>
                    <a href="https://www.which.co.uk/money/savings-and-isas/" 
                       target="_blank" rel="noopener noreferrer"
                       style={{ color: '#6366f1', textDecoration: 'none', fontSize: '0.85rem' }}>
                      → Which? Savings Comparison
                    </a>
                    <a href="https://www.bankrate.co.uk/savings-accounts/" 
                       target="_blank" rel="noopener noreferrer"
                       style={{ color: '#6366f1', textDecoration: 'none', fontSize: '0.85rem' }}>
                      → Bankrate UK Savings
                    </a>
                    <a href="https://www.fca.org.uk/consumers/cash-savings-comparison-tables" 
                       target="_blank" rel="noopener noreferrer"
                       style={{ color: '#6366f1', textDecoration: 'none', fontSize: '0.85rem' }}>
                      → FCA Cash Savings Tables
                    </a>
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
              <li><strong>How much can I save tax-free in an ISA?</strong> £20,000 per tax year for 2025/26. This can be split between Cash ISAs and Stocks & Shares ISAs.</li>
              <li><strong>When do I pay tax on savings interest?</strong> Basic rate taxpayers have a £1,000 personal savings allowance. Higher rate taxpayers get £500. Additional rate taxpayers get £0. Above this, you pay income tax.</li>
              <li><strong>What are the best UK savings rates in 2025?</strong> Top easy access accounts offer 4-5% AER. Fixed rate bonds can offer slightly higher but lock your money away.</li>
              <li><strong>How does daily compounding work?</strong> Interest is calculated daily and added to your balance, meaning you earn interest on interest. This calculator uses UK-realistic monthly compounding for regular contributions.</li>
              <li><strong>Should I choose ISA or regular savings?</strong> ISAs are almost always better due to tax-free status. Only consider regular accounts if you've used your ISA allowance or need specific features.</li>
            </ul>
          </div>
          
          <div className="content-block">
            <h2>Types of UK Savings Accounts</h2>
            <ul>
              <li><strong>Cash ISA:</strong> Tax-free savings up to £20,000 annually. Interest is completely tax-free regardless of amount.</li>
              <li><strong>Easy Access Accounts:</strong> Withdraw money anytime. Rates typically 3-5% but can vary. Subject to personal savings allowance.</li>
              <li><strong>Fixed Rate Bonds:</strong> Lock money away for 1-5 years for guaranteed rates, often 0.5-1% higher than easy access.</li>
              <li><strong>Regular Savings:</strong> High rates (up to 7%) but limited monthly deposits, usually £250-500. Good for building savings habits.</li>
              <li><strong>Notice Accounts:</strong> Higher rates in exchange for giving 30-120 days' notice before withdrawals.</li>
            </ul>
          </div>
          
          <div className="content-block">
            <h2>Important Calculation Notes</h2>
            <ul>
              <li><strong>Monthly Contributions:</strong> This calculator uses UK-realistic monthly compounding for regular deposits, not the same frequency as the base rate.</li>
              <li><strong>Tax Calculations:</strong> Based on current 2025 personal savings allowances. Actual tax depends on your total income and circumstances.</li>
              <li><strong>ISA Limits:</strong> Apply per tax year (April 6th to April 5th). You cannot carry over unused allowance to the next year.</li>
              <li><strong>Inflation Impact:</strong> Optional real returns show purchasing power after inflation. UK inflation target is 2% annually.</li>
              <li><strong>Provider Variations:</strong> Actual returns may vary based on provider-specific terms, minimum balances, and withdrawal restrictions.</li>
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
