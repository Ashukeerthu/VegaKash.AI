import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { EnhancedSEO } from '../../../components/EnhancedSEO';
import { AEOContentSection } from '../../../components/AEOContentSection';
import SEO from '../../../components/SEO';
import Breadcrumb from '../../../components/Breadcrumb';
import InfoTooltip from '../../../components/InfoTooltip';
import { calculateLoan, debounce, getTypicalRateRange } from '../../../utils/loanCalculator';
import { getTooltip } from '../../../utils/loanTooltips';
import { 
  LOAN_TYPES, 
  LOAN_AMOUNT, 
  INTEREST_RATE, 
  LOAN_TERM, 
  START_YEAR,
  MONTHS,
  DEFAULT_START_DATE,
  FAQ_SCHEMA,
  HIGH_INTEREST_THRESHOLD,
  LONG_TERM_THRESHOLD,
  EXTRA_PAYMENT_SAVINGS
} from '../../../constants/loanConstants';
import { 
  parseCurrencyInput, 
  parsePercentageInput, 
  parseNumericInput, 
  validateRange,
  formatCurrency as formatCurrencyUtil,
  downloadCSV 
} from '../../../utils/inputUtils';
import '../../../styles/Calculator.css';
import '../../../styles/SEOContent.css';
import '../../../styles/AEOContent.css';

/**
 * US Loan Payment Calculator - GLOBAL & COUNTRY-SPECIFIC
 * Calculates monthly payment, total interest, and amortization for any US loan with SEO
 * Uses production-grade layout matching existing calculator standards
 */
function LoanPaymentCalculatorUS() {
  const { country } = useParams();
  
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Calculators', path: '/calculators' },
    { label: 'Loan Payment Calculator', path: null }
  ];
  
  const [loanAmount, setLoanAmount] = useState(LOAN_AMOUNT.DEFAULT);
  const [interestRate, setInterestRate] = useState(INTEREST_RATE.DEFAULT);
  const [years, setYears] = useState(LOAN_TERM.DEFAULT);
  const [loanType, setLoanType] = useState(LOAN_TYPES.PERSONAL.value);
  const [startMonth, setStartMonth] = useState(DEFAULT_START_DATE.month);
  const [startYear, setStartYear] = useState(DEFAULT_START_DATE.year);
  const [result, setResult] = useState(null);
  const [amortizationView, setAmortizationView] = useState('yearly');
  const [showAmortization, setShowAmortization] = useState(false);
  const [showAllMonths, setShowAllMonths] = useState(false);

  // Debounced calculation function
  const performCalculation = useCallback(() => {
    const inputs = {
      loanAmount,
      interestRate,
      years,
      loanType,
      startMonth,
      startYear
    };
    
    const calculatedResult = calculateLoan(inputs);
    if (calculatedResult) {
      // Development logging only
      if (process.env.NODE_ENV === 'development') {
        console.log('Loan calculation result:', calculatedResult);
      }
      setResult(calculatedResult);
    }
  }, [loanAmount, interestRate, years, loanType, startMonth, startYear]);

  // Create debounced version (300ms delay)
  const debouncedCalculate = useMemo(
    () => debounce(performCalculation, 300),
    [performCalculation]
  );

  // Trigger calculation on input changes
  useEffect(() => {
    debouncedCalculate();
  }, [debouncedCalculate]);

  // Initial calculation on mount
  useEffect(() => {
    performCalculation();
  }, []);

  const handleReset = useCallback(() => {
    setLoanAmount(LOAN_AMOUNT.DEFAULT);
    setInterestRate(INTEREST_RATE.DEFAULT);
    setYears(LOAN_TERM.DEFAULT);
    setLoanType(LOAN_TYPES.PERSONAL.value);
    setStartMonth(DEFAULT_START_DATE.month);
    setStartYear(DEFAULT_START_DATE.year);
    setShowAllMonths(false);
  }, []);

  // Update interest rate when loan type changes
  const handleLoanTypeChange = useCallback((newType) => {
    setLoanType(newType);
    const range = getTypicalRateRange(newType);
    setInterestRate(range.typical);
  }, []);

  // Memoized formatCurrency to prevent re-creation on every render
  const formatCurrency = useCallback((value) => {
    return formatCurrencyUtil(value, false);
  }, []);

  // CSV Download Handler
  const handleDownloadCSV = useCallback(() => {
    if (!result || !result.amortizationSchedule) return;
    
    const data = amortizationView === 'yearly' 
      ? result.amortizationSchedule.yearly.map(row => ({
          'Year': row.yearLabel,
          'Principal Paid': formatCurrency(row.principal),
          'Interest Paid': formatCurrency(row.interest),
          'Ending Balance': formatCurrency(row.balance)
        }))
      : (showAllMonths ? result.amortizationSchedule.monthly : result.amortizationSchedule.monthly.slice(0, 24)).map(row => ({
          'Payment #': row.month,
          'Date': row.date,
          'Principal Paid': formatCurrency(row.principal),
          'Interest Paid': formatCurrency(row.interest),
          'Ending Balance': formatCurrency(row.balance)
        }));
    
    const filename = `loan-amortization-${amortizationView}-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(data, filename);
  }, [result, amortizationView, showAllMonths, formatCurrency]);

  // Get display data for amortization (limited or full)
  const displayedAmortization = useMemo(() => {
    if (!result || !result.amortizationSchedule) return [];
    
    if (amortizationView === 'monthly' && !showAllMonths) {
      return result.amortizationSchedule.monthly.slice(0, 24);
    }
    
    return amortizationView === 'yearly' 
      ? result.amortizationSchedule.yearly 
      : result.amortizationSchedule.monthly;
  }, [result, amortizationView, showAllMonths]);

  // SEO configuration
  const seoConfig = {
    title: country 
      ? `US Loan Payment Calculator for ${country.toUpperCase()}`
      : 'US Loan Payment Calculator – Monthly Payment & Amortization',
    description: country
      ? `Calculate your US loan monthly payment, total interest, and amortization for ${country.toUpperCase()}. Free, fast, accurate loan calculator.`
      : 'Calculate your US loan monthly payment, total interest, and amortization schedule. Free, fast, accurate loan payment calculator for the USA.',
    keywords: country
      ? `US loan calculator ${country.toUpperCase()}, monthly payment, amortization`
      : 'US loan calculator, monthly payment, amortization schedule, loan interest',
    tool: 'loan',
    country: country || undefined,
    supportedCountries: ['us'],
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
          <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>💰</span>
            US Loan Payment Calculator
          </h1>
          <p style={{ opacity: 0.75 }}>Calculate your monthly loan payment, total interest, and amortization schedule</p>
        </div>

        <div className="calculator-content">
          <div className="calculator-main-grid">
            <div className="calculator-inputs">
              {/* Loan Type Selector */}
              <div className="slider-group">
                <div className="slider-header" style={{ marginBottom: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                    <span>Loan Type</span>
                    <InfoTooltip {...getTooltip('loanType')} />
                  </label>
                </div>
                <div className="loan-type-select">
                  <select
                    value={loanType}
                    onChange={(e) => handleLoanTypeChange(e.target.value)}
                  >
                    <option value="auto">🚗 Auto Loan</option>
                    <option value="personal">💰 Personal Loan</option>
                    <option value="student">🎓 Student Loan</option>
                    <option value="home-equity">🏠 Home Equity Loan</option>
                    <option value="business">💼 Business Loan</option>
                    <option value="other">📋 Other Loan</option>
                  </select>
                </div>
              </div>

              {/* Loan Amount */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    Loan Amount
                    <InfoTooltip {...getTooltip('loanAmount')} />
                  </label>
                  <input
                    type="text"
                    value={formatCurrency(loanAmount)}
                    onChange={(e) => {
                      const parsed = parseCurrencyInput(e.target.value);
                      if (parsed !== null) {
                        setLoanAmount(parsed);
                      }
                    }}
                    onBlur={(e) => {
                      const parsed = parseCurrencyInput(e.target.value);
                      setLoanAmount(validateRange(parsed, LOAN_AMOUNT.MIN, LOAN_AMOUNT.MAX, LOAN_AMOUNT.DEFAULT));
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min={LOAN_AMOUNT.MIN}
                  max={LOAN_AMOUNT.MAX}
                  step={LOAN_AMOUNT.STEP}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>$1K</span>
                  <span>$1M</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    Interest Rate (% p.a.)
                    <InfoTooltip {...getTooltip('interestRate')} />
                  </label>
                  <input
                    type="text"
                    value={`${interestRate}%`}
                    onChange={(e) => {
                      const parsed = parsePercentageInput(e.target.value);
                      if (parsed !== null) {
                        setInterestRate(parsed);
                      }
                    }}
                    onBlur={(e) => {
                      const parsed = parsePercentageInput(e.target.value);
                      setInterestRate(validateRange(parsed, INTEREST_RATE.MIN, INTEREST_RATE.MAX, INTEREST_RATE.DEFAULT));
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min={INTEREST_RATE.MIN}
                  max={INTEREST_RATE.MAX}
                  step={INTEREST_RATE.STEP}
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>0%</span>
                  <span>36%</span>
                </div>
              </div>

              {/* Loan Term */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    Loan Term
                    <InfoTooltip {...getTooltip('loanTerm')} />
                  </label>
                  <input
                    type="text"
                    value={`${years} Yrs`}
                    onChange={(e) => {
                      const parsed = parseNumericInput(e.target.value);
                      if (parsed !== null) {
                        setYears(parsed);
                      }
                    }}
                    onBlur={(e) => {
                      const parsed = parseNumericInput(e.target.value);
                      setYears(validateRange(parsed, LOAN_TERM.MIN, LOAN_TERM.MAX, LOAN_TERM.DEFAULT));
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min={LOAN_TERM.MIN}
                  max={LOAN_TERM.MAX}
                  step={LOAN_TERM.STEP}
                  value={years}
                  onChange={(e) => setYears(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>1 Yr</span>
                  <span>30 Yrs</span>
                </div>
              </div>

              {/* Start Date */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    Start Date
                    <InfoTooltip {...getTooltip('startDate')} />
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select
                      value={startMonth}
                      onChange={(e) => setStartMonth(e.target.value)}
                      className="input-display"
                      style={{ flex: 1 }}
                    >
                      <option value="Jan">Jan</option>
                      <option value="Feb">Feb</option>
                      <option value="Mar">Mar</option>
                      <option value="Apr">Apr</option>
                      <option value="May">May</option>
                      <option value="Jun">Jun</option>
                      <option value="Jul">Jul</option>
                      <option value="Aug">Aug</option>
                      <option value="Sep">Sep</option>
                      <option value="Oct">Oct</option>
                      <option value="Nov">Nov</option>
                      <option value="Dec">Dec</option>
                    </select>
                    <input
                      type="number"
                      value={startYear}
                      onChange={(e) => setStartYear(e.target.value)}
                      className="input-display"
                      style={{ flex: 1 }}
                      min={START_YEAR.MIN}
                      max={START_YEAR.MAX}
                    />
                  </div>
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

            {/* Results Section - Monthly Payment Card Only */}
            {result && (
              <div className="calculator-results">
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>Your Loan Breakdown</h2>
                
                {/* Top Summary Card - EMI Style */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '16px',
                  padding: '2rem',
                  marginBottom: '1.5rem',
                  boxShadow: '0 6px 18px rgba(102, 126, 234, 0.25)',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.95rem', opacity: '0.9', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>EMI</div>
                  <div style={{ fontSize: '3rem', fontWeight: '700', letterSpacing: '-0.02em' }}>{formatCurrency(result.monthlyPayment)}</div>
                </div>

                {/* Breakdown Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ 
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: '600' }}>Principal Amount</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>{formatCurrency(result.loanAmount)}</div>
                  </div>
                  <div style={{ 
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: '600' }}>Total Interest</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>{formatCurrency(result.totalInterest)}</div>
                  </div>
                </div>

                {/* Total Amount Card */}
                <div style={{ 
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: '600' }}>Total Amount</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>{formatCurrency(result.totalAmount)}</div>
                </div>

                {/* Payment Breakdown Chart */}
                <div className="breakdown-chart" style={{ marginTop: '1.5rem' }}>
                  <h3>Payment Breakdown</h3>
                  <div className="chart-bar">
                    <div 
                      className="chart-segment principal"
                      style={{ width: `${(result.loanAmount / result.totalAmount * 100).toFixed(1)}%` }}
                    >
                      <span className="chart-label">Principal</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{(result.loanAmount / result.totalAmount * 100).toFixed(0)}%</span>
                    </div>
                    <div 
                      className="chart-segment interest"
                      style={{ width: `${(result.totalInterest / result.totalAmount * 100).toFixed(1)}%` }}
                    >
                      <span className="chart-label">Interest</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{(result.totalInterest / result.totalAmount * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="legend-color principal"></div>
                      <span>Principal: {formatCurrency(result.loanAmount)}</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color interest"></div>
                      <span>Interest: {formatCurrency(result.totalInterest)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Loan Details Section - 2 Column Layout */}
          {result && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '2rem', marginBottom: '2rem' }}>
              {/* Loan Summary */}
              <div style={{ 
                padding: '1.5rem', 
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: '#059669', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 2C13.418 2 17 5.582 17 10C17 14.418 13.418 18 9 18H4C2.895 18 2 17.105 2 16V10C2 5.582 5.582 2 9 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 6V10L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Loan Summary
                </h3>
                <div style={{ display: 'grid', gap: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.95rem' }}>
                    <span style={{ color: '#64748b' }}>Loan Type</span>
                    <strong style={{ textTransform: 'capitalize', color: '#1e293b' }}>{result.loanType.replace('-', ' ')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.95rem' }}>
                    <span style={{ color: '#64748b' }}>Loan Amount</span>
                    <strong style={{ color: '#1e293b' }}>{formatCurrency(result.loanAmount)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid #e2e8f0', marginTop: '0.25rem', fontSize: '0.95rem' }}>
                    <span style={{ color: '#64748b' }}>Total of {years * 12} Payments</span>
                    <strong style={{ color: '#1e293b' }}>{formatCurrency(result.totalAmount)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.95rem' }}>
                    <span style={{ color: '#64748b' }}>Total Interest Paid</span>
                    <strong style={{ color: '#dc2626' }}>{formatCurrency(result.totalInterest)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.08) 0%, rgba(239, 68, 68, 0.05) 100%)', margin: '0.25rem 0', borderRadius: '8px', border: '1px solid rgba(220, 38, 38, 0.15)' }}>
                    <span style={{ color: '#dc2626', fontWeight: '600' }}>Interest as % of Loan</span>
                    <strong style={{ color: '#dc2626', fontSize: '1.15rem' }}>{((parseFloat(result.totalInterest) / parseFloat(result.loanAmount)) * 100).toFixed(1)}%</strong>
                  </div>
                  {parseFloat(result.effectiveRate) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid #e2e8f0', marginTop: '0.25rem', fontSize: '0.95rem' }}>
                      <span style={{ color: '#64748b' }}>Effective Annual Rate (APR)</span>
                      <strong style={{ color: '#1e293b' }}>{result.effectiveRate}%</strong>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', marginTop: '0.5rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.05) 100%)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <span style={{ color: '#059669', fontWeight: '600' }}>Payoff Date</span>
                    <strong style={{ fontSize: '1.1rem', color: '#059669' }}>{result.payoffDate}</strong>
                  </div>
                </div>
              </div>

              {/* Save with Extra Payments + Smart Loan Tips Combined */}
              <div style={{ 
                padding: '1.5rem', 
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: '#2563eb', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 2L2 7L10 12L18 7L10 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L10 17L18 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Save Money with Extra Payments
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(22, 163, 74, 0.05) 100%)', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Extra Payment</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>$100/month</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.85rem', color: '#16a34a', marginBottom: '0.25rem' }}>You Save</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#16a34a' }}>
                        ~{formatCurrency(parseFloat(result.totalInterest) * 0.12)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.06) 100%)', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Extra Payment</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>$250/month</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.85rem', color: '#16a34a', marginBottom: '0.25rem' }}>You Save</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#16a34a' }}>
                        ~{formatCurrency(parseFloat(result.totalInterest) * 0.25)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', borderLeft: '3px solid #3b82f6' }}>
                    <span style={{ fontSize: '1.25rem' }}>💡</span>
                    <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0, lineHeight: '1.6' }}>
                      <strong style={{ color: '#1e293b' }}>Pro Tip:</strong> Making extra payments can significantly reduce your loan term.
                    </p>
                  </div>

                  {/* Smart Loan Tips - Integrated */}
                  <div style={{ marginTop: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: '#9333ea', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M10 6V10L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Smart Loan Tips
                    </h4>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      {parseFloat(result.totalInterest) / parseFloat(result.loanAmount) > 0.5 && (
                        <div style={{ display: 'flex', gap: '0.625rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', borderLeft: '3px solid #ef4444' }}>
                          <span style={{ fontSize: '1.1rem' }}>⚠️</span>
                          <div style={{ flex: 1 }}>
                            <strong style={{ color: '#dc2626', fontSize: '0.875rem', display: 'block', marginBottom: '0.2rem' }}>High Interest Cost</strong>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem', lineHeight: '1.4' }}>You'll pay {((parseFloat(result.totalInterest) / parseFloat(result.loanAmount)) * 100).toFixed(0)}% in interest. Consider a shorter term.</p>
                          </div>
                        </div>
                      )}
                      {years > 7 && (
                        <div style={{ display: 'flex', gap: '0.625rem', padding: '0.75rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)', borderLeft: '3px solid #f59e0b' }}>
                          <span style={{ fontSize: '1.1rem' }}>💡</span>
                          <div style={{ flex: 1 }}>
                            <strong style={{ color: '#d97706', fontSize: '0.875rem', display: 'block', marginBottom: '0.2rem' }}>Long Loan Term</strong>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem', lineHeight: '1.4' }}>A {years}-year term means more interest. Reducing to 5 years could save thousands.</p>
                          </div>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '0.625rem', padding: '0.75rem', background: 'rgba(34, 197, 94, 0.05)', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.2)', borderLeft: '3px solid #22c55e' }}>
                        <span style={{ fontSize: '1.1rem' }}>✓</span>
                        <div style={{ flex: 1 }}>
                          <strong style={{ color: '#16a34a', fontSize: '0.875rem', display: 'block', marginBottom: '0.2rem' }}>Refinancing Opportunity</strong>
                          <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem', lineHeight: '1.4' }}>If rates drop by 1%+, refinancing could save you money.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Amortization Schedule Section */}
        {result && result.amortizationSchedule && (
          <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 1.5rem' }}>
            <div className="amortization-section" style={{ marginTop: '2rem', width: '100%' }}>
            <div 
              className="amortization-header" 
              onClick={() => setShowAmortization(!showAmortization)} 
              style={{ 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '1rem', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white', 
                borderRadius: '12px', 
                marginBottom: showAmortization ? '1.5rem' : '0'
              }}
            >
              <h3 style={{ margin: 0, fontSize: 'clamp(1rem, 3vw, 1.25rem)', fontWeight: '700' }}>Loan Amortization Schedule</h3>
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                style={{ 
                  transform: showAmortization ? 'rotate(180deg)' : 'rotate(0deg)', 
                  transition: 'transform 0.3s ease',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }}
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {showAmortization && (
              <>
                {/* Amortization Controls */}
                <div className="amortization-controls">
                  <button onClick={handleDownloadCSV} className="download-csv-btn">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4.66667 6.66667L8 10L11.3333 6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 10V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Download CSV
                  </button>
                  {amortizationView === 'monthly' && result.amortizationSchedule.monthly.length > 24 && (
                    <div className="month-limit-toggle">
                      <label>
                        <input 
                          type="checkbox" 
                          checked={showAllMonths} 
                          onChange={(e) => setShowAllMonths(e.target.checked)}
                        />
                        <span>Show all {result.amortizationSchedule.monthly.length} months</span>
                      </label>
                    </div>
                  )}
                </div>

                <div className="amortization-tabs" style={{ 
                  display: 'flex', 
                  gap: 'clamp(0.5rem, 2vw, 1rem)', 
                  marginBottom: '1.5rem',
                  width: '100%',
                  maxWidth: '100%'
                }}>
                  <button 
                    className={`tab-btn ${amortizationView === 'yearly' ? 'active' : ''}`}
                    onClick={() => setAmortizationView('yearly')}
                    style={{
                      flex: 1,
                      padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1.5rem)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: amortizationView === 'yearly' ? '#4f46e5' : '#e5e7eb',
                      color: amortizationView === 'yearly' ? 'white' : '#374151',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Yearly
                  </button>
                  <button 
                    className={`tab-btn ${amortizationView === 'monthly' ? 'active' : ''}`}
                    onClick={() => setAmortizationView('monthly')}
                    style={{
                      flex: 1,
                      padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1.5rem)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: amortizationView === 'monthly' ? '#4f46e5' : '#e5e7eb',
                      color: amortizationView === 'monthly' ? 'white' : '#374151',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Monthly
                  </button>
                </div>
                
                <div style={{ 
                  position: 'relative',
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'hidden'
                }}>
                  <div 
                    className="amortization-table" 
                    role="region"
                    aria-label="Loan Amortization Schedule"
                    tabIndex={0}
                    style={{ 
                      overflowX: 'auto',
                      WebkitOverflowScrolling: 'touch',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      width: '100%'
                    }}>
                    <table role="table" aria-label={`${amortizationView === 'yearly' ? 'Yearly' : 'Monthly'} Amortization Schedule`} style={{ 
                      width: '100%', 
                      minWidth: amortizationView === 'monthly' ? '600px' : '500px',
                      borderCollapse: 'separate',
                      borderSpacing: 0,
                      fontSize: '14px'
                    }}>
                      <thead role="rowgroup">
                        <tr role="row" style={{ 
                          background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)', 
                          borderBottom: '2px solid #dee2e6',
                          position: 'sticky',
                          top: 0,
                          zIndex: 10
                        }}>
                          <th role="columnheader" scope="col" style={{ 
                            padding: '12px 16px', 
                            textAlign: 'left', 
                            fontWeight: '700',
                            fontSize: '0.875rem',
                            color: '#212529',
                            borderRight: '1px solid #dee2e6',
                            background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            {amortizationView === 'yearly' ? 'YEAR' : '#'}
                          </th>
                          {amortizationView === 'monthly' && (
                            <th role="columnheader" scope="col" style={{ 
                              padding: '12px 16px', 
                              textAlign: 'center', 
                              fontWeight: '700',
                              fontSize: '0.875rem',
                              color: '#212529',
                              borderRight: '1px solid #dee2e6',
                              background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>DATE</th>
                          )}
                          <th role="columnheader" scope="col" style={{ 
                            padding: '12px 16px', 
                            textAlign: 'right', 
                            fontWeight: '700',
                            fontSize: '0.875rem',
                            color: '#212529',
                            borderRight: '1px solid #dee2e6',
                            background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>PRINCIPAL</th>
                          <th role="columnheader" scope="col" style={{ 
                            padding: '12px 16px', 
                            textAlign: 'right', 
                            fontWeight: '700',
                            fontSize: '0.875rem',
                            color: '#212529',
                            borderRight: '1px solid #dee2e6',
                            background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>INTEREST</th>
                          <th role="columnheader" scope="col" style={{ 
                            padding: '12px 16px', 
                            textAlign: 'right', 
                            fontWeight: '700',
                            fontSize: '0.875rem',
                            color: '#212529',
                            background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>ENDING BALANCE</th>
                        </tr>
                      </thead>
                      <tbody role="rowgroup">
                        {displayedAmortization.map((row, index) => (
                              <tr key={index} role="row" className="am-row" style={{ 
                                background: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                                borderBottom: '1px solid #e9ecef',
                                transition: 'background-color 0.15s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#e7f1ff'}
                              onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? '#ffffff' : '#f8f9fa'}
                              >
                                <td role="cell" data-label={amortizationView === 'yearly' ? 'Year' : '#'} style={{ 
                                  padding: '10px 16px', 
                                  fontWeight: '600',
                                  fontSize: '0.875rem',
                                  color: '#212529',
                                  borderRight: '1px solid #e9ecef'
                                }}>{amortizationView === 'yearly' ? row.yearLabel : row.month}</td>
                                {amortizationView === 'monthly' && (
                                  <td role="cell" data-label="Date" style={{ 
                                    padding: '10px 16px', 
                                    textAlign: 'center', 
                                    fontSize: '0.8rem',
                                    color: '#495057',
                                    borderRight: '1px solid #e9ecef',
                                    whiteSpace: 'nowrap'
                                  }}>{row.date}</td>
                                )}
                                <td role="cell" data-label="Principal" style={{ 
                                  padding: '10px 16px', 
                                  textAlign: 'right',
                                  fontSize: '0.875rem',
                                  color: '#495057',
                                  borderRight: '1px solid #e9ecef',
                                  fontFamily: 'monospace'
                                }}>{formatCurrency(row.principal)}</td>
                                <td data-label="Interest" style={{ 
                                  padding: '10px 16px', 
                                  textAlign: 'right',
                                  fontSize: '0.875rem',
                                  color: '#495057',
                                  borderRight: '1px solid #e9ecef',
                                  fontFamily: 'monospace'
                                }}>{formatCurrency(row.interest)}</td>
                                <td data-label="Ending Balance" style={{ 
                                  padding: '10px 16px', 
                                  textAlign: 'right', 
                                  fontWeight: '600',
                                  fontSize: '0.875rem',
                                  color: '#0066cc',
                                  fontFamily: 'monospace'
                                }}>{formatCurrency(row.balance)}</td>
                              </tr>
                            ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
            </div>
          </div>
        )}

        {/* SEO Content Section */}
        <div className="seo-content-section">
          <div className="content-block">
            <h2>How to Calculate US Loan Payments</h2>
            <p>The formula for calculating your loan payment is:</p>
            <div className="formula-box">
              <strong>M = P × [r(1 + r)^n] / [(1 + r)^n - 1]</strong>
            </div>
            <p>Where:</p>
            <ul>
              <li><strong>M</strong> = Monthly payment</li>
              <li><strong>P</strong> = Principal loan amount</li>
              <li><strong>r</strong> = Monthly interest rate (annual rate ÷ 12)</li>
              <li><strong>n</strong> = Number of payments (years × 12)</li>
            </ul>
          </div>

          <div className="content-block">
            <h2>US Loan Payment FAQ</h2>
            <ul>
              <li><strong>What is a loan payment?</strong> The amount you pay monthly to repay a loan, including both principal and interest.</li>
              <li><strong>How is US loan interest calculated?</strong> Most US loans use monthly compounding and fixed rates for the life of the loan.</li>
              <li><strong>What affects my loan rate?</strong> Credit score, loan amount, loan term, purpose, and current market rates all influence your interest rate.</li>
              <li><strong>Can I pay off my loan early?</strong> Yes, most loans allow early repayment without penalties, which can save you significant interest.</li>
              <li><strong>What's the difference between fixed and variable rates?</strong> Fixed rates stay the same throughout the loan term, while variable rates can change based on market conditions.</li>
            </ul>
          </div>

          <div className="content-block">
            <h2>Types of US Loans</h2>
            <p>Different loan types have varying terms and interest rates:</p>
            <ul>
              <li><strong>Auto Loans:</strong> Typically 3-7 years with interest rates based on credit score and vehicle type</li>
              <li><strong>Personal Loans:</strong> Unsecured loans with terms usually 2-7 years and rates from 6-36%</li>
              <li><strong>Student Loans:</strong> Federal loans (3-7%) and private loans with various repayment options</li>
              <li><strong>Home Equity Loans:</strong> Secured against your home with competitive rates (5-12%)</li>
              <li><strong>Business Loans:</strong> Terms and rates vary widely based on business credit and revenue</li>
            </ul>
          </div>

          <div className="content-block">
            <h2>Understanding Amortization</h2>
            <p>Amortization is the process of paying off a loan through regular monthly payments. Each payment covers both the interest on the outstanding balance and a portion of the principal. Early in the loan term, a larger portion goes toward interest. As you pay down the principal, more of each payment goes toward reducing the balance.</p>
            <p>This calculator provides a complete amortization schedule showing exactly how much principal and interest you'll pay each month or year, helping you understand the true cost of your loan over time.</p>
          </div>
        </div>

        {/* AEO Content Section - Optimized for Answer Engines */}
        <AEOContentSection tool="loan" country={country} />

        {/* Structured Data - Financial Product */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FinancialProduct",
          "name": "US Loan Payment Calculator",
          "description": "Calculate your US loan monthly payment and total interest.",
          "provider": {"@type": "Organization", "name": "VegaKash.AI"},
          "applicationCategory": "Calculator",
          "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}
        })}</script>
        
        {/* Structured Data - FAQ Schema */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQ_SCHEMA.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        })}</script>
      </div>
    </>
  );
}

export default LoanPaymentCalculatorUS;
